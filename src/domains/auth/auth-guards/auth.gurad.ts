import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../dtos/user.dto';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;
      return !!user;
    } catch (error) {
      if (error.status === 401) {
        throw new NotFoundException({ status: 401, message: 'Unauthorized' });
      }
    }
  }
}
