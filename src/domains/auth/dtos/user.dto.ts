import { ApiProperty } from '@nestjs/swagger';

import { MaxLength } from 'class-validator';
import { SocialMethodType } from '../helpers/constants';

export class User {
  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '이메일',
    default: 'asd123@gmail.com',
  })
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @MaxLength(32)
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 사진(회원가입시에는 이미지 설정X, 기본이미지)',
    default: null,
  })
  profilePath: string;

  @ApiProperty({
    description: '소셜 로그인 메서드(자체 회원가입인 경우 null)',
    default: null,
  })
  loginMethod: SocialMethodType;
}
