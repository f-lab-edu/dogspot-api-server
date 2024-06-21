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
    return await this.prisma.walksBoard.create({ dto });
  }
}