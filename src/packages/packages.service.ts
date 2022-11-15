import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { IsNull, Repository } from 'typeorm';
import { CreatePackageInput, FeaturesInput, PackageFeatureInput } from './dto/create-package.input';
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

  async createFeatures(featuresInput: FeaturesInput): Promise<any> {
    const features = [];
    for (let z = 0; z < featuresInput.features.length; z++) {
      let ftr = featuresInput.features[z];
      const subfeatures = [];
      // console.log(typeof ftr.);
      
      if (typeof ftr.package_subfeatures_input != 'undefined' && ftr.package_subfeatures_input.length > 0) {
        for (let i = 0; i < ftr.package_subfeatures_input.length; i++) {
          ftr.package_subfeatures_input[i].feature_group = ftr.feature_code;
          let ft = await this.reposFeature.create(ftr.package_subfeatures_input[i]);
          let ftrs = await this.reposFeature.save(ft);
          if (typeof ftrs.id == 'number') {
            subfeatures.push(ftrs);
          }
        }
      }
      const sv = new PackageFeature();
      // sv = {...featuresInput};
      ftr.package_subfeatures = subfeatures;
      const cr = await this.reposFeature.create(ftr);
      features.push(await this.reposFeature.save(cr));
    }

    // console.log(features);
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

  listFeature(param: PackageFeatures[], datas: PackageFeature[], id: any = null) {
    let res: PackageFeature[] = [];
    let py = param;
    let parents = datas;
    for(let i = 0 ; i < datas.length ; i++){
      if(py.length == 0){
        break;
      }
      if(typeof parents[i].subfeature == 'undefined'){
        parents[i]['subfeature'] = [];
      }
      res.push(parents[i]);
      // if()
      for(let j = 0 ; j < py.length ; j ++){
        
        if(py[j].feature.parent_feature != null){
          // console.log(res[i])
          if(py[j].feature.parent_feature.id == parents[i].id && py[j].feature_value != null){
            //  pc = new PackageFeature();
            let pc = py[j].feature
            pc.feature_value = py[j].feature_value;
            // res.push(parents[i]);
            res[i].subfeature.push(pc);
            
           
          }
        }else if(py[j].feature.parent_feature == null && py[j].feature.id == parents[i].id && py[j].feature_value != null){
          res[i].feature_value = py[j].feature_value;
        }
        py = py.splice(j, 1);
        console.log({
          afterRemovePy: py
        })
      }
      if(res[i].subfeature.length == 0 && res[i].feature_value == null){
        res = res.splice(i, 1);
      }
    }
    // console.log({
    //   return: res,
    //   id: id
    // });
    // console.log(JSON.stringify(res));
    return res;
  }

  async findFeatures(): Promise<PackageFeature[]>{
    let parentList = await this.reposFeature.find({
      relations: ['parent_feature', 'subfeature'],
    });

    return parentList;
  }

  async findAll(option: MetaQuery = null): Promise<any[]> {
    const response = [];
    // console.log('test')
    const datas = await this.repos.find({
      relations: ['package_features', 'package_features.feature', 'package_features.feature.parent_feature'],
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

    // console.log(JSON.stringify(datas));
    // throw new HttpException({ message: "Tidak ada data!" }, HttpStatus.NOT_FOUND);
    if (datas.length == 0) {
      throw new HttpException({ message: "Tidak ada data!" }, HttpStatus.NOT_FOUND);
    }
    // console.log()
    
    // console.log(parentList);
    // throw new HttpException({ message: "Tidak ada data!" }, HttpStatus.NOT_FOUND);
    for (let i = 0; i < datas.length; i++) {
      if(datas[i].id >= 3){
      let data = datas[i];
      let parentList = await this.reposFeature.find({
        relations: ['parent_feature'],
        where: {
          parent_feature: IsNull()
        }
      });
      const prls = parentList;
      // let prls = parentList;
      // console.log({...data.package_features})
      let pr = new PackageResponse();
      Object.entries(data).forEach(([k, v]) => {
        pr[k] = v;
      });
      let f = data.package_features;
      if(f.length > 0){
        let ft = this.listFeature(f, prls, pr.id);
        console.log({
          id: datas[i].id,
          returning: JSON.stringify(ft)
        })
        pr.package_features = ft;
      }

      // prls = null;
      
      response.push(pr);
    }
    }

    // console.log(JSON.stringify(response));
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
