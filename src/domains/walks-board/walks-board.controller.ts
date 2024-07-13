import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { createBoardDto } from './dtos/create-board.dto';
import { boardJoinDto } from './dtos/board-join';
import { BoardService } from './walks-board.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from '../auth/decorators/auth-user.decorator';
import { User } from '../auth/dtos/user.dto';
import { SwaggerTag } from '../../core/swagger/swagger-tag';
import { ApiOkPaginationResponseTemplate } from '../../core/swagger/api-ok-pagination-response';
import { ApiCreatedResponseTemplate } from '../../core/swagger/api-created-response';
import { ApiOkResponseTemplate } from '../../core/swagger/api-ok-response';
import { boardDto } from './dtos/board.dto';
import { PageRequest } from '../../core/page';

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
      const result = await this.boardService.createBoard(dto, user.idx);
      return res.status(StatusCodes.CREATED).send({
        result: result,
      });
    } catch (error) {
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
    const boards = await this.boardService.getBoardList(pageRequest);
    return res.status(StatusCodes.OK).send({
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
    try {
      const board = await this.boardService.findWalksBoard(warlsBoardIdx);
      return res.status(StatusCodes.OK).send({
        board: board,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: error.message,
      });
    }
  }

  @ApiOperation({
    summary: '산책 참여',
    description:
      '산책 참여 합니다. 등록 시, jwt토큰이 필요합니다. jwt 토큰은 dogspot.site/auth/api-docs 접속 후 Auth: 인증 -> /auth 사용하시면 얻을 수 있습니다.',
  })
  @ApiCreatedResponseTemplate({ type: boardJoinDto })
  @ApiBody({ type: boardJoinDto })
  @UseAuthGuards()
  @Post('/walksBoard/join')
  async walksJoin(
    @Res() res,
    @Body() dto: boardJoinDto,
    @AuthUser() user: User,
  ) {
    try {
      const result = await this.boardService.walksJoin(dto, user);
      return res.status(StatusCodes.CREATED).send({
        result: result,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        result: error.message,
      });
    }
  }
}