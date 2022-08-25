import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // console.log(value);
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    // console.log(errors)
    if (errors.length > 0) {
        let errRes = [];
        errors.forEach(val => {
            let msgs = [];
            Object.entries(val.constraints).forEach(([key, v]) => {
                msgs.push(v) 
            })
            errRes.push({
                property: val.property,
                value: val.value,
                messages: msgs
            })
        })
      throw new BadRequestException(errRes)
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    // console.log('toValidate');
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}