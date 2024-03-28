import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // NOTE: Runs something before a request is handled by request handler
    // console.log(`I'm running before request handler. `, context);

    // IMPORTANT: next instead of handler
    return next.handle().pipe(
      map((data: any) => {
        // NOTE: Run something before the response is sent out
        // console.log(`I'm running before the response is sent out. `, data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
