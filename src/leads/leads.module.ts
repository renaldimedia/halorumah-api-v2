import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsResolver } from './leads.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Property, User]), UsersModule, PropertiesModule],
  providers: [LeadsResolver, LeadsService]
})
export class LeadsModule {}
