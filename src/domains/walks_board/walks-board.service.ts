import { Injectable } from '@nestjs/common';

import { createBoardDto } from './dtos/create-board.dto';
import { boardJoinDto } from './dtos/board-join';
import { BoardRepository } from './repositories/walks-board.repository';
import { PageRequest } from '../../core/page';
import { KafkaService } from '../kafka/kafka.walks-push.service'; 
import { Topic } from '../kafka/helpers/constants';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository, private readonly kafkaService: KafkaService) {}

  async createBoard(dto: createBoardDto, userIdx: number) {
    const createdBoard = await this.boardRepository.createBoard(dto, userIdx);
    return createdBoard;
  }

  async getBoardList(pageRequest: PageRequest) {
    const boards = await this.boardRepository.getBoardList(pageRequest);
    return boards;
  }

  async findWalksBoard(warlsBoardIdx: number) {
    const board = await this.boardRepository.getBoard(warlsBoardIdx);
    return board;
  }

  async walksJoin(dto: boardJoinDto) {
    const board = await this.boardRepository.getBoard(dto.idx);
    await this.boardRepository.createWalkJoin(dto);
    const joinMembers = await this.boardRepository.getWalkJoinMember(board.idx);
    const result = await this.kafkaService.sendMessage(Topic.WALKS_PUSH, joinMembers);
    result.subscribe({
      next: (data) => console.log('Received data:', data),
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Complete'),
    });
    // console.log('result: ', result);
    
    return result;
  }

}
