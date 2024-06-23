import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserGuard } from './auth.gurad';

const UseAuthGuards = () => {
  return applyDecorators(UseGuards(UserGuard), ApiBearerAuth('accessToken'));
};

export default UseAuthGuards;
