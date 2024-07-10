import { Injectable } from '@nestjs/common';

import { createBoardDto } from './dtos/create-board.dto';
import { boardJoinDto } from './dtos/board-join';
import { BoardRepository } from './repositories/walks-board.repository';
import { PageRequest } from '../../core/page';
import { KafkaService } from '../kafka/kafka.walks-push.service';
import { Topic } from '../kafka/helpers/constants';
import { User } from '../auth/dtos/user.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async createBoard(dto: createBoardDto, userIdx: number) {
    const createdBoard = await this.boardRepository.createBoard(dto, userIdx);
    return createdBoard;
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
      // const board = await this.boardRepository.getBoard(dto.idx);
      // await this.boardRepository.canParticipate(dto, board);
      // await this.boardRepository.createWalkJoin(dto, user);
      // const message = await this.boardRepository.getWalkJoinMember(board, user);
      await this.kafkaService.sendMessage(
        Topic.WALKS,
        dto,
      );
    } catch (error) {
      throw new Error(`Failed to walksJoin: ${error.message}`);
    }
  }
}
