import { Injectable } from '@nestjs/common';

import { createBoardDto } from './dtos/create-board.dto';
import { BoardRepository } from './repositories/walks-board.repository';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository) {}

  async createBoard(dto: createBoardDto, userIdx: number) {
    const createdBoard = await this.boardRepository.createBoard(dto, userIdx);
    return createdBoard;
  }
}
