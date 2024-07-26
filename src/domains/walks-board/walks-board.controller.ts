import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StatusCodes } from 'http-status-codes';

import { BoardService } from './walks-board.service';
import { boardDto } from './dtos/board.dto';
import { createBoardDto } from './dtos/create-board.dto';
import { boardJoinDto } from './dtos/board-join';

import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from '../auth/decorators/auth-user.decorator';
import { User } from '../auth/dtos/user.dto';

import { SwaggerTag } from '../../core/swagger/swagger-tag';
import { ApiOkPaginationResponseTemplate } from '../../core/swagger/api-ok-pagination-response';
import { ApiCreatedResponseTemplate } from '../../core/swagger/api-created-response';
import { ApiOkResponseTemplate } from '../../core/swagger/api-ok-response';
import { PageRequest } from '../../core/page';
import { fileFilter } from '../../core/middleware/file.filter';
import { HttpErrorConstants } from '../../core/http/http-error-objects';

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: createBoardDto })
  @UseAuthGuards()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      fileFilter: fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한 (바이트 단위)
      },
    }),
  )
  @Post('/')
  async createBoard(
    @Res() res,
    @Body() dto: createBoardDto,
    @AuthUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const result = await this.boardService.createBoard(dto, user.idx, files);
      return res.status(StatusCodes.CREATED).send({
        result: result,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        HttpErrorConstants.INTERNAL_BOARD_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: '산책 게시글 조회',
    description: '산책 게시글을 20개씩 최신 정보를 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: boardDto })
  @Get('/')
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

  @ApiOperation({
    summary: '산책 게시글 삭제',
    description:
      '산책 게시글을 삭제합니다.',
  })
  @ApiBody({ type: boardJoinDto })
  @UseAuthGuards()
  @Delete('/:warlsBoardIdx')
  async deleteWalks(
    @Res() res,
    @Param('warlsBoardIdx') warlsBoardIdx: number,
    @AuthUser() user: User,
  ) {
    try {
      const result = await this.boardService.deleteWalks(warlsBoardIdx, user);
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
