import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { Lead, LeadResponse } from './entities/lead.entity';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { Info } from 'src/decorators/info.decorator';
import { Throttle } from '@nestjs/throttler';
import { User, UsersResponse } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UseGuards } from '@nestjs/common';
import { ThrottlerProxyGuard } from 'src/global-guards/throttle-proxy.guard';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { LeadMutationResponse } from './response';

@Resolver(() => Lead)
// @UseGuards(ThrottlerProxyGuard)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService, private readonly userService: UsersService) {}


  @Mutation(() => LeadMutationResponse)
  @Throttle(5, 60)
  createLead(@Args('createLeadInput') createLeadInput: CreateLeadInput) {
    return this.leadsService.create(createLeadInput);
  }

  @ResolveField(() => UsersResponse)
  async user(@Parent() ld: Lead): Promise<UsersResponse>{
    return await this.userService.findById(ld.user)
  }

  @Query(() => [LeadResponse], { name: 'leads' })
  // @UseGuards(ThrottlerProxyGuard)
  // @Throttle(1, 60)
  findAll(@Args('option', {nullable: true}) opt:MetaQuery = null) {
    // console.log(inf)
    // const fields = inf.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.leadsService.findAll(opt);
  }

  @Query(() => LeadResponse, { name: 'lead' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.leadsService.findOne(id);
  }

  @Mutation(() => Lead)
  updateLead(@Args('updateLeadInput') updateLeadInput: UpdateLeadInput) {
    return this.leadsService.update(updateLeadInput.id, updateLeadInput);
  }

  @Mutation(() => Lead)
  removeLead(@Args('id', { type: () => Int }) id: number) {
    return this.leadsService.remove(id);
  }
}
