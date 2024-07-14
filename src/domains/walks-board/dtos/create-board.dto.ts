import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class createBoardDto {
  @ApiProperty({
    description: '게시글 번호',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '제목',
    default: '오늘 오후 보라메 공원에서 산책하실분?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '장소',
    default: '간단한 장소 위치.',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: '지도 위치',
    default: '실제 지도 위치.',
  })
  @IsString()
  @IsNotEmpty()
  places: string;

  @ApiProperty({
    description: '산책 시간',
    default: '2023-06-13T00:00:00.000Z',
  })
  @IsNotEmpty()
  meetingDatetime: Date;

  @ApiProperty({
    description: '최대 참여자 수',
    default: 8,
    type: 'integer',
  })
  @IsNotEmpty()
  maxParticipants: number;

  @ApiProperty({
    description: '썸네일',
    default: '이미지 썸네일입니다.',
  })
  thumbnail: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: any;
}
