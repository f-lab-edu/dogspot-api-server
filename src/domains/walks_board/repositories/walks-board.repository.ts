import { Injectable } from '@nestjs/common';
import { PrismaClient, walks_board } from '@prisma/client';

import { createBoardDto } from '../dtos/create-board.dto';
import { PageRequest } from 'src/core/page';
import { boardJoinDto } from '../dtos/board-join';
import { User } from 'src/domains/auth/dtos/user.dto';
import { boardJoinSendDto } from '../dtos/board-join-send';

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
      console.error('Failed to fetch board list:', error);
      throw new Error(`Failed to fetch board list: ${error.message}`);
    }
  }
  async createWalkJoin(dto: boardJoinDto) {
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
  async canParticipate(dto: boardJoinDto, warlsBoard: walks_board) {
    try {
      // 특정 유저가 참여자 명단에 있는지 확인
      const participant = await this.prisma.walks_participants.findFirst({
        where: {
          walks_board_idx: warlsBoard.idx,
          user_idx: dto.userIdx,
        },
      });

      if (participant) {
        throw new Error(
          `User ${dto.userIdx} is already a participant of board ${warlsBoard.idx}`,
        );
      }
      // 해당 게시글의 총 참여자 수 계산
      const participantCount = await this.prisma.walks_participants.count({
        where: {
          walks_board_idx: warlsBoard.idx,
        },
      });

      if (warlsBoard.max_participants <= participantCount) {
        throw new Error(
          `Board ${warlsBoard.idx} has reached the maximum number of participants`,
        );
      }
    } catch (error) {
      console.error('Failed to check user and count participants:', error);
      throw new Error(
        `Failed to check user and count participants: ${error.message}`,
      );
    }
  }
  async getWalkJoinMember(warlsBoard: walks_board, user: User) {
    const boardParticipants = await this.prisma.walks_participants.findMany({
      where: {
        walks_board_idx: warlsBoard.idx,
      },
      include: {
        user: true,
      },
    });
    const kafkaDtos: boardJoinSendDto[] = [];

    // 각 참여자에 대해 message 속성을 추가하고 이를 새로운 배열에 저장
    boardParticipants.forEach((item) => {
      const data: boardJoinSendDto = {
        message: `${warlsBoard.title} 산책에 ${user.nickname} 님이 참석하였습니다.`,
        nickname: item.user.nickname,
        userIdx: item.user.idx,
        title: warlsBoard.title,
      };
      kafkaDtos.push(data);
    });
    return kafkaDtos;
  }
}
