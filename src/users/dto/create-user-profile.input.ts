import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { Profile } from '../entities/profile.entity';

@InputType()
export class CreateUserProfileInput {
    
    @Field({nullable: true})
    photo_profile: string
  
    
    @Field({nullable: true})
    display_name: string
  
    
    @Field({nullable: false})
    full_name: string
    
    
    @Field({nullable: true})
    account_whatsapp_number: number
  
    
    @Field({nullable: true})
    account_rumah123: string
  
    
    @Field({nullable: true})
    account_rumahcom: string
  
    
    @Field({nullable: true})
    account_olx: string
  
    
    @Field({nullable: true})
    account_lamudi: string
  
    
    @Field({nullable: true})
    account_discord: string
  
    
    @Field({nullable: true})
    property_count: number
  
    
    @Field({nullable: true})
    
    
    country: number
  
    
    @Field({nullable: true})
    
    
    province: number
  
    
    @Field({nullable: true})
    
    
    city: number
  
    
    @Field({nullable: true})
    
    
    subdistrict: number
  
    
    @Field(type => String, {nullable: true})
    full_address: string
  
    
    @Field(type => String, {nullable: true})
    agent_id: string
}
