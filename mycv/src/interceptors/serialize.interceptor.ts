import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Runs something before a request is handled by request handler
    console.log(`I'm running before request handler. `, context);

    return next.handle().pipe(
      // IMPORTANT: next instead of handler
      map((data: any) => {
        // Run something before the response is sent out
        console.log(`I'm running before the response is sent out. `, data);
      }),
    );
  }
}
