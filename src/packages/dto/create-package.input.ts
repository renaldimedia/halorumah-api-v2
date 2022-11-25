import { InputType, Int, Field, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';


@InputType()
export class PackageFeaturePriInput{
  @Field(() => Int, {nullable: true})
  id?: number;
  @Field(() => String, {nullable: true})
  feature_code?: string;
  @Field(() => String, {nullable: true, defaultValue: ""})
  feature_group?: string;
  @Field(() => String, {nullable: true})
  feature_name?: string;
  @Field(() => String, {defaultValue: 'string', nullable: true})
  feature_type?: string;
  @Field(() => String, {nullable: true})
  feature_value?: any;
  @Field(() => String, {nullable: true})
  feature_icon?: string;
  @Field(() => String, {nullable: true})
  value_prefix?: string;
  @Field(() => String, {nullable: true})
  value_suffix?: string;
  @Field(() => PackageFeaturePriInput, {nullable: true})
  parent_feature?: PackageFeaturePriInput
}

@InputType()
export class PackageFeatureInput extends PartialType(PackageFeaturePriInput){
  @Field(() => [PackageFeaturePriInput], {nullable: true})
  @IsOptional()
  package_subfeatures_input?: PackageFeaturePriInput[]

  @Field(() => [PackageFeaturePriInput], {nullable: true})
  @IsOptional()
  package_subfeatures?: PackageFeaturePriInput[]
}
@InputType()
export class PackageBanefitInput{
  @Field(type => Int) 
  package_listings: number;
  @Field(type => Int, {nullable: true, defaultValue: 0})
  package_featured_listings: number;
}
@InputType()
export class FeaturesInput{
  @Field(() => [PackageFeatureInput])
  features: PackageFeatureInput[];
}

@InputType()
export class PackageFeaturesInput{
  @Field(() => Int)
  feature_id: number;

  @Field(() => String)
  feature_value: string;
}

@InputType()
export class CreatePackageInput {
  @Field(() => Int, {nullable: true})
  id: number;

  @Field(() => String)
  package_name: string;

  @Field(() => Int)
  package_price: number;

  @Field(() => String)
  package_icon?: string;

  @Field(() => String)
  package_display_name?: string;

  @Field(() => String)
  package_code: string;

  @Field(() => Int)
  package_billing_time_unit: number;

  @Field(() => String)
  package_billing_unit: string;

  @Field(() => Boolean, {nullable: true})
  is_displayed?: boolean;

  @Field(() => Boolean, {nullable: true})
  is_enable?: boolean;

  @Field(() => Boolean, {nullable: true})
  is_popular?: boolean;

  @Field(() => [PackageFeaturesInput], {nullable: true})
  package_features?: PackageFeaturesInput[];
}
