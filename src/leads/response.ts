import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { Any } from 'typeorm';
import { LeadResponse } from './entities/lead.entity';

@ObjectType()
export class LeadMutationResponse extends GlobalMutationResponse {
    @Field(() => LeadResponse, {nullable: true})
    lead: LeadResponse
}
