import { Injectable } from '@nestjs/common';
import { PrismaClient, walks_board } from '@prisma/client';

import { createBoardDto } from '../dtos/create-board.dto';
import { PageRequest } from 'src/core/page';

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
      await this.prisma.$transaction(async (prisma) => {
        const createdBoard = await prisma.walks_board.create({
          data: {
            user_idx: dto.userIdx,
            title: dto.title,
            description: dto.description,
            location: dto.location,
            places: dto.places,
            max_participants: dto.maxParticipants,
            meeting_datetime: dto.meetingDatetime,
            thumbnail: dto.thumbnail,
          },
        });

        const boardMediaPromises = dto.fileUrl.map((item, i) =>
          prisma.board_media.create({
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
      throw new Error(`Failed to create board: ${error.message}`);
    }
  }
  async getBoardList(pageRequest: PageRequest): Promise<walks_board[]> {
    try {
      const boards = await this.prisma.walks_board.findMany({
        skip: pageRequest.offset,
        take: pageRequest.limit,
        orderBy: { created_at: pageRequest.order === 'ASC' ? 'asc' : 'desc' },
        include: {
          user: {
            select: {
              email: true,
              nickname: true,
              profile_path: true,
            },
          },
        },
      });
      return boards; // 조회된 walks_board 리스트 반환
    } catch (error) {
      console.error('Failed to fetch board list:', error);
      throw new Error(`Failed to fetch board list: ${error.message}`);
    }
  }

  async getBoard(warlsBoardIdx: number): Promise<walks_board | null> {
    try {
      const board = await this.prisma.walks_board.findUnique({
        where: {
          idx: warlsBoardIdx,
        },
      });

      if (!board) {
        throw new Error(`게시글을 찾을 수 없습니다: ${warlsBoardIdx}`);
      }
      return board; // 조회된 walks_board 리스트 반환
    } catch (error) {
      throw new Error(`Failed to fetch board: ${error.message}`);
    }
  }
}
