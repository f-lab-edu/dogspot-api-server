import { Injectable } from '@nestjs/common';

import { createBoardDto } from './dtos/create-board.dto';
import { BoardRepository } from './repositories/walks-board.repository';
import { PageRequest } from 'src/core/page';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository) {}

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
}
