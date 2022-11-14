import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { Repository } from 'typeorm';
import { CreatePackageInput, PackageFeatureInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { PackageFeature } from './entities/package-feature.entity';
import { PackageFeatures } from './entities/package-features.entity';
import { Package, PackageResponse } from './entities/package.entity';

@Injectable()
export class PackagesService {

  constructor(
    @InjectRepository(Package) private readonly repos: Repository<Package>,
    @InjectRepository(PackageFeature) private readonly reposFeature: Repository<PackageFeature>,
    @InjectRepository(PackageFeatures) private readonly reposFeatures: Repository<PackageFeatures>
  ) { }

  async createFeatures(featuresInput: PackageFeatureInput[]): Promise<PackageFeature[]> {
    const features = [];
    for (let z = 0; z < featuresInput.length; z++) {
      const subfeatures = [];
      // console.log(typeof featuresInput[z].);
      if (typeof featuresInput[z].package_subfeatures_input != 'undefined' && featuresInput[z].package_subfeatures_input.length > 0) {
        for (let i = 0; i < featuresInput[z].package_subfeatures_input.length; i++) {
          featuresInput[z].package_subfeatures_input[i].feature_group = featuresInput[z].feature_code;
          let ft = await this.reposFeature.create(featuresInput[z].package_subfeatures_input[i]);
          let ftrs = await this.reposFeature.save(ft);
          if (typeof ftrs.id == 'number') {
            subfeatures.push(ftrs);
          }
        }
      }
      const sv = new PackageFeature();
      // sv = {...featuresInput};
      featuresInput[z].package_subfeatures = subfeatures;
      const cr = await this.reposFeature.create(featuresInput[z]);
      features.push(await this.reposFeature.save(cr));
    }


    return features;
  }

  async create(createPackageInput: CreatePackageInput): Promise<Package> {

    const { package_features } = createPackageInput;
    const cr = await this.repos.create(createPackageInput);
    const pack = await this.repos.save(cr);

    if (package_features.length > 0) {
      let fet = [];
      for (let i = 0; i < package_features.length; i++) {
        let cr2 = new PackageFeatures();
        cr2.package = pack;
        let ftr = new PackageFeature();
        ftr.id = package_features[i].feature_id;
        cr2.feature = ftr;
        cr2.feature_value = package_features[i].feature_value;
        fet.push(cr2);
        // await this.reposFeatures.save(cr2);
        // this.reposFeatures.save()
      }

      if (fet.length > 0) {
        await this.reposFeatures.save(fet)
      }
    }
    console.log(pack);
    return pack;
  }

  async findAllSub(): Promise<any[]> {
    const response = [];
    const datas = await this.reposFeatures.find({
      relations: {
        package: true,
        feature: true
      }
    });

    return datas;
  }

  listFeature(param: PackageFeatures[]) {
    let f = param;
    let ftr = [];
    let prnt = [];
    if (f.length > 0) {
      for (let i = 0; i < f.length; i++) {
        let fitem = f[i].feature;
        fitem.feature_value = f[i].feature_value;
        // console.log(fitem.parent_feature.id)
        // ftr[idx]['subfeature']
        // fitem['subfeature'] = this.listFeature();
      
        if(typeof fitem.parent_feature == 'undefined' || fitem.parent_feature == null){
          ftr.push(fitem);
        }else{
          let idx = ftr.findIndex(s => s.id == fitem.parent_feature.id);
          if(typeof idx == 'number' && idx > 0){
            if(typeof ftr[idx]['subfeature'] == 'undefined'){
              ftr[idx]['subfeature'] = [];  
            }
            ftr[idx]['subfeature'].push(fitem)
          }
        }
      }
    }

    return ftr;
  }

  async findAll(option: MetaQuery = null): Promise<PackageResponse[]> {
    const response = [];

    const datas = await this.repos.find({
      relations: ['package_features', 'package_features.feature', 'package_features.feature.subfeature'],
      order: {
        ord: 'ASC',
        package_features: {
          feature: {
            parent_feature: {
              id: 'DESC'
            }
          }
        }
      }
    });

    console.log(JSON.stringify(datas));
    if (datas.length == 0) {
      throw new HttpException({ message: "Tidak ada data!" }, HttpStatus.NOT_FOUND);
    }
    // console.log()
    datas.forEach(data => {
      // console.log({...data.package_features})
      let f = data.package_features;
      // data.package_features = this.listFeature(f);
      // console.log(data.package_features);
      response.push(data);
      // data['package_features']
    });
    return response;
  }

  async findOne(id: number): Promise<Package> {
    const data = await this.repos.findOne({
      relations: ['package_features', 'package_features.feature', 'package_features.feature.parent_feature'],
      where: { id: id }
    });

    let f = data.package_features;
    let ftr = [];
    if (f.length > 0) {
      for (let i = 0; i < f.length; i++) {
        let fitem = f[i].feature;
        
        fitem.feature_value = f[i].feature_value;
        ftr.push(fitem);
      }
    }
    data.package_features = ftr;

    return data;
    // return `This action returns a #${id} package`;
  }

  update(id: number, updatePackageInput: UpdatePackageInput) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
