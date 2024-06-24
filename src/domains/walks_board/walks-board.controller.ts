import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tag';
import { createBoardDto } from './dtos/create-board.dto';
import { BoardService } from './walks-board.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from '../auth/decorators/auth-user.decorator';
import { User } from '../auth/dtos/user.dto';

@ApiTags(SwaggerTag.BOARD)
@Controller('/walksBoard')
export class Boardcontroller {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '산책 게시글 등록',
    description:
      '장소, 시간, 날짜, 내용, 제목, 이미지를 등록합니다. 등록 시, jwt토큰이 필요합니다. jwt 토큰은 dogspot.site/auth/api-docs 접속 후 Auth: 인증 -> /auth 사용하시면 얻을 수 있습니다.',
  })
  @ApiCreatedResponseTemplate({ type: createBoardDto })
  @ApiBody({ type: createBoardDto })
  @UseAuthGuards()
  @Post('/walksBoard')
  async createBoard(
    @Res() res,
    @Body() dto: createBoardDto,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.createBoard(dto, user.userIdx);
    return res.status(200).send({
      result: result,
    });
  }
}
