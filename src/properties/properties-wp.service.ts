import { Injectable } from '@nestjs/common';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { Sequelize } from 'sequelize-typescript';
import { PropertyResponse } from './entities/get-all-props.response';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { exit } from 'process';

@Injectable()
export class PropertiesWPService {
  constructor(private readonly wpdb: Sequelize) { }

  async findAllWP($exclude = [], option: MetaQuery = null, fields: string[]): Promise<any> {
    let results = Array<PropertyResponse>;

    let select = [];
    let join = [];
    let where = [];

    if (fields != null && fields.length > 0) {
      fields.forEach(val => {
        switch (val) {
          case 'city':
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            select.push("trm.name AS 'city'");
            join.push(`
              INNER JOIN Ip8RF9_term_relationships AS trls ON post.ID = trls.object_id
              LEFT JOIN Ip8RF9_term_taxonomy AS ttx ON trls.term_taxonomy_id = ttx.term_taxonomy_id
              LEFT JOIN Ip8RF9_terms AS trm ON ttx.term_id = trm.term_id
              `);
            where.push(`ttx.taxonomy = 'property_city'`);
            break;
          case 'province':
            select.push("prov.name AS 'province'");
            join.push(`
            INNER JOIN
            Ip8RF9_term_relationships AS trls2 ON post.ID = trls2.object_id
                LEFT JOIN
            Ip8RF9_term_taxonomy AS ttx2 ON trls2.term_taxonomy_id = ttx2.term_taxonomy_id
                LEFT JOIN
            Ip8RF9_terms AS prov ON ttx2.term_id = prov.term_id
              `);
              where.push(`ttx2.taxonomy = 'property_state'`);
            break;
          case 'country':
            select.push("country.name AS 'country'");
            join.push(`
                INNER JOIN
                Ip8RF9_term_relationships AS trls3 ON post.ID = trls3.object_id
                LEFT JOIN
                Ip8RF9_term_taxonomy AS ttx3 ON trls3.term_taxonomy_id = ttx3.term_taxonomy_id
                LEFT JOIN
                Ip8RF9_terms AS country ON ttx3.term_id = country.term_id
              `);
              where.push(`ttx3.taxonomy = 'property_country'`);
            break;
          case 'property_type':
            // query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            select.push("proptype.name AS 'property_type'");
            join.push(`
                INNER JOIN
                Ip8RF9_term_relationships AS trls4 ON post.ID = trls4.object_id
                LEFT JOIN
                Ip8RF9_term_taxonomy AS ttx4 ON trls4.term_taxonomy_id = ttx4.term_taxonomy_id
                LEFT JOIN
                Ip8RF9_terms AS proptype ON ttx4.term_id = proptype.term_id
              `);
              where.push(`ttx4.taxonomy = 'property_type'`);
            break;
          case 'property_bathroom_count':
            select.push(`pmt2.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt2 ON post.ID = pmt2.post_id`);
            where.push(`pmt2.meta_key = 'fave_property_bathrooms'`);
            break;
          case 'property_price':
            select.push(`pmt.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt ON post.ID = pmt.post_id`);
            where.push(`pmt.meta_key = 'fave_property_price'`);
            break;
          case 'property_bedroom_count':
            select.push(`pmt3.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt3 ON post.ID = pmt3.post_id`);
            where.push(`pmt3.meta_key = 'fave_property_bedrooms'`);
            break;
          case 'property_building_size':
            select.push(`pmt4.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt4 ON post.ID = pmt4.post_id`);
            where.push(`pmt4.meta_key = 'fave_property_size'`);
            break;
          case 'property_area_size':
            select.push(`pmt5.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt5 ON post.ID = pmt5.post_id`);
            where.push(`pmt5.meta_key = 'fave_property_land'`);
            break;
          case 'property_full_address' || 'property_full_address_rendered':
            select.push(`pmt6.meta_value as '${val}'`);
            join.push(`INNER JOIN Ip8RF9_postmeta as pmt6 ON post.ID = pmt6.post_id`);
            where.push(`pmt6.meta_key = 'fave_property_map_address'`);
            break;
          default:
            // select.push(`prop.${val}`);
            break;
        }
      });
    }

    let selectQ = select.join(",");
    let joinQ = join.join("\n");
    let whereQ = where.join("AND ");

    let q = `SELECT DISTINCT
    post.ID as 'old_id',
    post.post_title as 'property_title',
    post.post_content as 'property_desc',
    post.post_author,
    post.post_date as 'created_at'
    ${selectQ != "" ? "," + selectQ : ""}
FROM
    Ip8RF9_posts AS post
    ${joinQ}
       
        
WHERE
    post.post_type = 'property'
        AND post.post_status = 'publish'
        ${whereQ != "" ? " AND " + whereQ : ""}
        AND 1 = 1
ORDER BY post.post_date DESC
LIMIT :limit;`;
    const data = await this.wpdb.query(q, {
      replacements: {
        limit: option != null && typeof option.take == 'number' ? option.take : 10
      }
    });
    console.log(data);exit;
    if (data.length > 0) {
      let ids = [];
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i]['ID']);
      }
      q = ``
    }
    const res = new GlobalMutationResponse();
    res.affected = data.length;
    res.ok = true;

    return res;
  }

}
