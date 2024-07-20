import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { createBoardDto } from './dtos/create-board.dto';
import { boardJoinDto } from './dtos/board-join';
import { BoardRepository } from './repositories/walks-board.repository';
import { PageRequest } from '../../core/page';
import { KafkaService } from '../kafka/kafka.walks-push.service';
import { Topic } from '../kafka/helpers/constants';
import { User } from '../auth/dtos/user.dto';
import { WinstonLogger } from '../../utils/logger/logger';
import { HttpErrorConstants } from '../../core/http/http-error-objects';
import { FileService } from '../file/file.service';
import { FilePath } from './helpers/constants';
import { log } from 'console';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private readonly kafkaService: KafkaService,
    private readonly fileService: FileService,
  ) {}

  async createBoard(
    dto: createBoardDto,
    userIdx: number,
    files: Express.Multer.File[],
  ) {
    try {
      let savedFiles = [];
      const createdBoard = await this.boardRepository.createBoard(
        dto,
        userIdx,
        savedFiles,
      );
      // 파일 저장
      if (files && files.length > 0) {
        console.log('파일 있음!!!!!!!!!!!');
        savedFiles = await this.fileService.saveFiles(
          files,
          FilePath.WALKS_BOARD_PATH,
        );
        await this.kafkaService.sendMessage(
          Topic.WALKS_BOARD_CREATE,
          createdBoard.idx,
        );
      }
      return createdBoard;
    } catch (error) {
      // 에러 로그
      WinstonLogger.error(`Failed at BoardService -> createBoard: ${error}`);
      if (error.response) {
        // boardRepository에서 throw가 발생한 경우
        throw new InternalServerErrorException(error.response);
      } else {
        throw new InternalServerErrorException(
          HttpErrorConstants.INTERNAL_BOARD_ERROR,
        );
      }
    }
  }

  async getBoardList(pageRequest: PageRequest) {
    const boards = await this.boardRepository.getBoardList(pageRequest);
    return boards;
  }

  async findWalksBoard(warlsBoardIdx: number) {
    try {
      const board = await this.boardRepository.getBoard(warlsBoardIdx);
      if (!board) {
        throw new Error(`Board not found.`);
      }
      return board;
    } catch (error) {
      throw new Error(`Failed to findWalksBoard: ${error.message}`);
    }
  }

  async walksJoin(dto: boardJoinDto, user: User) {
    try {
      dto.userDto = user;
      await this.kafkaService.sendMessage(Topic.WALKS, dto);
    } catch (error) {
      throw new Error(`Failed to walksJoin: ${error.message}`);
    }
  }
}
