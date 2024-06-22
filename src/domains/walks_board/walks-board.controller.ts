import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tag';
import { createBoardDto } from './dtos/create-board.dto';
import { BoardService } from './walks-board.service';

@ApiTags(SwaggerTag.BOARD)
@Controller('/walksBoard')
export class Boardcontroller {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시판 등록',
    description: '각 게시판 별로 등록한다.',
  })
  @ApiCreatedResponseTemplate({ type: createBoardDto })
  @ApiBody({ type: createBoardDto })
  // @UseAuthGuards()
  @Post('/walksBoard')
  async createBoard(
    @Res() res,
    @Body() dto: createBoardDto,
    // @AuthUser() user: User,
  ) {
    const result = await this.boardService.createBoard(dto, 1);
    return res.status(200).send({
      result: result,
    });
  }
}
