import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument, UserFlattened } from 'src/users/user.schema';

export const User = createParamDecorator(
  (data: keyof UserFlattened | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserFlattened = request.user;
    return data ? user?.[data] : user;
  },
);
