import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserRepository {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserByIdx(userIdx: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          idx: userIdx,
        },
      });
      return user;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`Failed to find user by idx: ${error.message}`);
    }
  }
}
