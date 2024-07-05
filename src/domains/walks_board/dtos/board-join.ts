import { ApiProperty } from '@nestjs/swagger';

export class boardJoinDto {
  @ApiProperty({
    description: '게시글 번호',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  userIdx: number;
}
