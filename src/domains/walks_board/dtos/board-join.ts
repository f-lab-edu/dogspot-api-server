import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/domains/auth/dtos/user.dto';

export class boardJoinDto {
  @ApiProperty({
    description: '게시글 번호',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '유저 Dto',
    default: 1,
  })
  userDto: User;
}
