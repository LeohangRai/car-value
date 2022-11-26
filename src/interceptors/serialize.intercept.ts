import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

/* custom serializationn interceptor */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }
}

/* custom serialization decorator that wraps our interceptor class */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/* 
  interface to use for type annotation in our decorator parameter, 
  allows only classes to be passed as an argument
*/
/* eslint-disable */
interface ClassConstructor {
  new (...args: any[]): {};
}
/* eslint-enable */
