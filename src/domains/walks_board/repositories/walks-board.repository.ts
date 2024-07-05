import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { createBoardDto } from '../dtos/create-board.dto';
import { PageRequest } from 'src/core/page';
import { boardJoinDto } from '../dtos/board-join';

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
      console.log('error: ', error);
      throw new Error(`Failed to create board: ${error.message}`);
    }
  }
  async getBoardList(pageRequest: PageRequest) {
    try {
      const boards = await this.prisma.walks_board.findMany({
        skip: pageRequest.offset, // 건너뛸 개수 설정
        take: pageRequest.limit, // 가져올 개수 설정
        orderBy: { created_at: pageRequest.order === 'ASC' ? 'asc' : 'desc' }, // 정렬 방식 설정
      });
      return boards; // 조회된 walks_board 리스트 반환
    } catch (error) {
      console.error('Failed to fetch board list:', error);
      throw new Error(`Failed to fetch board list: ${error.message}`);
    }
  }
  async getBoard(warlsBoardIdx: number) {
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
      console.error('Failed to fetch board list:', error);
      throw new Error(`Failed to fetch board list: ${error.message}`);
    }
  }
  async createWalkJoin (dto: boardJoinDto){
    try {
      // Prisma를 사용하여 walksBoard 생성 및 boardMedia 생성을 트랜잭션으로 묶음
        await this.prisma.walks_participants.create({
          data: {
            walks_board_idx: dto.idx,
            user_idx: dto.userIdx,
          },
        });

        return true;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`Failed to create board: ${error.message}`);
    }
  }
  async getWalkJoinMember (warlsBoardIdx: number){
    const result = await this.prisma.walks_participants.findMany({
      where: {
        walks_board_idx: warlsBoardIdx,
      },
    });

    return result;
  }
}
