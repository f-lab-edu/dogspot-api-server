import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../dtos/user.dto';

const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);

export default AuthUser;
