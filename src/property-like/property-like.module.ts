import { Module } from '@nestjs/common';
import { PropertyLikeService } from './property-like.service';
import { PropertyLikeResolver } from './property-like.resolver';
import { PropertyLike } from './entities/property-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { User } from 'src/users/entities/user.entity';
import { Property } from 'src/properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyLike, Property, User]), UsersModule, PropertiesModule],
  providers: [PropertyLikeResolver, PropertyLikeService]
})
export class PropertyLikeModule {}
