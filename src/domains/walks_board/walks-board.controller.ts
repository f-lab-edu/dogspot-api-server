import { Body, Controller, Get, HttpException, Param, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tag';
import { createBoardDto } from './dtos/create-board.dto';
import { BoardService } from './walks-board.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from '../auth/decorators/auth-user.decorator';
import { User } from '../auth/dtos/user.dto';
import { ApiOkPaginationResponseTemplate } from 'src/core/swagger/api-ok-pagination-response';
import { ApiOkResponseTemplate } from 'src/core/swagger/api-ok-response';
import { boardDto } from './dtos/board.dto';
import { PageRequest } from 'src/core/page';

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
    try {
      console.log(user);
      throw new HttpException('에러 테스트', 500);
      const result = await this.boardService.createBoard(dto, user.idx);
      return res.status(200).send({
        result: result,
      });
    } catch (error) {
      // res.status(500).send({
      //   message: error.message,
      // });
      throw error;
    }
  }

  @ApiOperation({
    summary: '산책 게시글 조회',
    description: '산책 게시글을 20개씩 최신 정보를 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: boardDto })
  @Get('/walksBoard')
  async getBoard(@Res() res, @Query() pageRequest: PageRequest) {
    console.log(
      'pageRequest instanceof PageRequest:',
      pageRequest instanceof PageRequest,
    );
    const boards = await this.boardService.getBoardList(pageRequest);
    return res.status(200).send({
      boards: boards,
    });
  }

  @ApiOperation({
    summary: '게시판 상세조회',
    description: '게시판을 상세 조회 기능입니다.',
  })
  @ApiOkResponseTemplate({ type: boardDto })
  @Get('/:warlsBoardIdx')
  async findWalksBoard(
    @Res() res,
    @Param('warlsBoardIdx') warlsBoardIdx: number,
  ) {
    const board = await this.boardService.findWalksBoard(warlsBoardIdx);
    return res.status(200).send({
      board: board,
    });
  }
}
