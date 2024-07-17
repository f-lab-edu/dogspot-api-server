import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, walks_board } from '@prisma/client';

import { createBoardDto } from '../dtos/create-board.dto';
import { PageRequest } from '../../../core/page';
import { SaveFileDto } from '../../file/dtos/save.file.dto';
import { HttpErrorConstants } from '../../../core/http/http-error-objects';
import { WinstonLogger } from '../../../utils/logger/logger';

@Injectable()
export class BoardRepository {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBoard(
    dto: createBoardDto,
    userIdx: number,
    savedFiles: SaveFileDto[],
  ): Promise<walks_board> {
    dto.userIdx = userIdx;
    try {
      // Prisma를 사용하여 walksBoard 생성 및 boardMedia 생성을 트랜잭션으로 묶음
      const createdBoard = await this.prisma.$transaction(async (prisma) => {
        const board = await prisma.walks_board.create({
          data: {
            user_idx: dto.userIdx,
            title: dto.title,
            description: dto.description,
            location: dto.location,
            places: dto.places,
            // max_participants:
            //   process.env.MODE === 'dev' ? 8 : dto.maxParticipants,
            max_participants: 8,
            meeting_datetime: dto.meetingDatetime,
            thumbnail: dto.thumbnail,
          },
        });

        // board_media 엔티티를 생성하는 비동기 작업을 순차적으로 실행
        for (let i = 0; i < savedFiles.length; i++) {
          const item = savedFiles[i];
          await this.prisma.board_media.create({
            data: {
              walks_board_idx: board.idx,
              type: item.type,
              thumbnail_url: null, // 나중에 리사이즈 이미지가 필요할 때 사용하려고 만들었습니다.
              original_file_url: item.path,
              sequence: i,
            },
          });
        }
        return board;
      });
      return createdBoard;
    } catch (error) {
      WinstonLogger.error(`Failed at BoardRepository -> createBoard: ${error}`);
      throw new InternalServerErrorException(
        HttpErrorConstants.INTERNAL_BOARD_ERROR,
      );
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
