import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { boardMedia } from './board-media.dto'; // boardMedia를 직접 import합니다.

export class createBoardDto {
  @ApiProperty({
    description: '유저 번호',
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
    description: '썸네일',
    default: '이미지 썸네일입니다.',
  })
  thumbnail: string;

  @ApiProperty({
    description:
      '미디어(사진, 영상)가 있으면 미디어 처리 서버에 먼저 보내고, DB에 저장될 데이터 리턴 받아 넣어줘야 합니다.',
    default: [
      {
        type: 'img',
        url: 'https://dogspot.s3.ap-northeast-2.amazonaws.com/board/20230629233511-42b37a7f-20d1-43f3-8615-9cb01e8ac99d-N1.jpeg',
      },
    ],
  })
  fileUrl: boardMedia[]; // boardMedia를 직접 사용합니다.
}
