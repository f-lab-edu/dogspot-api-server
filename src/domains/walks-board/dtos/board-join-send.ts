import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class boardJoinSendDto {
  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  nickname: string;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  message: string;
}
