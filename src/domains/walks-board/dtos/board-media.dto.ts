import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class boardMedia {
  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  walksBoardIdx: number;

  @ApiProperty({
    description: '미디어 종류:',
    default: '이미지 or 영상',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: '썸네일',
    default: '이미지 썸네일입니다.',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'url',
    default: '저장된 파일 위치입니다. 기본 env.baseUrl + /폴더 디렉토리입니다.',
  })
  url: string;
}
