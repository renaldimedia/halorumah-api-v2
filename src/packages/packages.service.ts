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

    if (typeof package_features != 'undefined' && package_features.length > 0) {
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
    // let res: PackageFeature[] = [];
    for (let i = 0; i < datas.length; i++) {
      if (param.length == 0) {
        break;
      }
      if (datas[i].parent_feature == null && typeof datas[i].subfeature == 'undefined') {
        datas[i]['subfeature'] = [];
      }
      // if()
      for (let j = 0; j < param.length; j++) {

        if (param[j].feature.parent_feature != null) {
          // console.log(datas[i])
          if (param[j].feature.parent_feature.id == datas[i].id && param[j].feature_value != null) {
            //  pc = new PackageFeature();
            let pc = param[j].feature
            pc.feature_value = param[j].feature_value;
            // datas.push(datas[i]);
            datas[i]['subfeature'].push(pc);


          }
        } else if (param[j].feature.parent_feature == null && param[j].feature.id == datas[i].id && param[j].feature_value != null) {
          datas[i].feature_value = param[j].feature_value;
        }
        param = param.splice(j, 1);
        console.log({
          afterRemoveparam: param
        })
      }
      if (typeof datas[i] != 'undefined' && (typeof datas[i].parent_feature != 'undefined' && datas[i].parent_feature == null)
        && (typeof datas[i].subfeature != 'undefined' && datas[i].subfeature.length == 0) && (typeof datas[i].feature_value != 'undefined' && datas[i].feature_value == null)) {
        datas = datas.splice(i, 1);
      }
    }
    return datas;
  }

  async lftr(data: PackageFeatures[]) {
    // const res = [];
    const parent = [];
    let idx = 0;
    data.forEach((item) => {

      item.feature.feature_value = item.feature_value;
      if (item.feature.parent_feature != null) {
        if (typeof parent[item.feature.parent_feature.id] == 'undefined') {
          parent[item.feature.parent_feature.id] = item.feature.parent_feature;
          if (typeof parent[item.feature.parent_feature.id]['subfeature'] == 'undefined') {
            parent[item.feature.parent_feature.id]['subfeature'] = [];
            parent[item.feature.parent_feature.id]['subfeature'].push(item.feature);
          } else {
            // if(parent[item.feature.parent_feature.id]['subfeature'][idx] != null)
            parent[item.feature.parent_feature.id]['subfeature'].push(item.feature);
          }
        } else {
          if (typeof parent[item.feature.parent_feature.id]['subfeature'] == 'undefined') {
            parent[item.feature.parent_feature.id]['subfeature'] = [];
            parent[item.feature.parent_feature.id]['subfeature'].push(item.feature);
          } else {
            parent[item.feature.parent_feature.id]['subfeature'].push(item.feature);
          }
        }

        parent[item.feature.parent_feature.id]['subfeature'].sort((a, b) => {

          return a.ord - b.ord;
        });
      } else {
        parent[item.feature.id] = item.feature;
      }

      idx++;
    });

    let res = await parent.filter(n => n);

    res.sort((a, b) => {

      return a.ord - b.ord;
    });
    // console.log({
    //   parent: parent.filter(n => n)
    // });
    return res;
  }

  async findFeatures(): Promise<PackageFeature[]> {
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
      // if(datas[i].id >= 3){
      let data = datas[i];
      // console.log({...data.package_features})
      let pr = new PackageResponse();
      Object.entries(data).forEach(([k, v]) => {
        pr[k] = v;
      });
      let f = data.package_features;
      if (f.length > 0) {
        let ft = await this.lftr(f);
        // console.log({
        //   id: datas[i].id,
        //   returning: JSON.stringify(ft)
        // })
        pr.package_features = ft;
      }

      // prls = null;

      response.push(pr);
      // }
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
