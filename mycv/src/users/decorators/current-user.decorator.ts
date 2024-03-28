import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // NOTE: 'never' means that the CurrentUser decorator doesn't need an argument
    const request = context.switchToHttp().getRequest();
    // console.log(request.session.userId);
    return request.currentUser;
  },
);
