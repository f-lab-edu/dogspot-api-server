import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../walks-board.service';
import { Boardcontroller } from '../walks-board.controller';
import { StatusCodes } from 'http-status-codes';
import { BoardRepository } from '../repositories/walks-board.repository';
import { KafkaService } from '../../kafka/kafka.walks-push.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PageRequest } from 'src/core/page';

describe('BoardController (walksBoard)', () => {
  let controller: Boardcontroller;
  let module: TestingModule;
  let boardService: BoardService; // BoardService 추가

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'dev' ? 'dev.env' : 'prod.env',
        }),
      ],
      controllers: [Boardcontroller],
      providers: [BoardService, KafkaService, ConfigService, BoardRepository],
    }).compile();

    controller = module.get<Boardcontroller>(Boardcontroller);
    boardService = module.get<BoardService>(BoardService); // BoardService 가져오기 추가
  });

  afterEach(async () => {
    await module.close();
  });

  it('should get board list', async () => {
    const mockPageRequest: PageRequest = {
      page: 1,
      limit: 20,
      offset: 0,
      existsNextPage: function (totalCount: number): boolean {
        throw new Error(`Function not implemented. ${totalCount}`);
      },
    };

    const mockBoards = [
      {
        idx: 1,
        user_idx: 1,
        title: 'Board 1',
        description: 'Description of Board 1',
        location: 'Location 1',
        places: 'Places 1',
        meeting_datetime: new Date(),
        max_participants: 5,
        thumbnail: 'thumbnail_url_1',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        idx: 2,
        user_idx: 2,
        title: 'Board 2',
        description: 'Description of Board 2',
        location: 'Location 2',
        places: 'Places 2',
        meeting_datetime: new Date(),
        max_participants: 3,
        thumbnail: 'thumbnail_url_2',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    jest.spyOn(boardService, 'getBoardList').mockResolvedValue(mockBoards);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controller.getBoard(res, mockPageRequest);

    expect(boardService.getBoardList).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith({
      boards: mockBoards,
    });
  });
});
