import { Injectable } from '@nestjs/common';
import { createBoardDto } from '../dtos/create-board.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BoardRepository {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBoard(dto: createBoardDto, userIdx: number) {
    dto.userIdx = userIdx;
    try {
      // Prisma를 사용하여 walksBoard 생성 및 boardMedia 생성을 트랜잭션으로 묶음
      const result = await this.prisma.$transaction(async (prisma) => {
        const createdBoard = await prisma.walksBoard.create({
          data: {
            user_idx: dto.userIdx,
            title: dto.title,
            description: dto.description,
            location: dto.location,
            places: dto.places,
            meetingDatetime: dto.meetingDatetime,
            thumbnail: dto.thumbnail,
          },
        });
        console.log(createdBoard);

        const boardMediaPromises = dto.fileUrl.map((item, i) =>
          prisma.boardMedia.create({
            data: {
              walks_board_idx: createdBoard.idx,
              type: item.type,
              thumbnail: null, // 나중에 리사이즈 이미지가 필요할 때 사용하려고 만들었습니다.
              url: item.url,
              sequence: i,
            },
          }),
        );

        await Promise.all(boardMediaPromises);
        return true;
      });
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`Failed to create board: ${error.message}`);
    }
  }
}
