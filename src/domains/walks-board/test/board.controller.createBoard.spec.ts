import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'supertest';
import { Boardcontroller } from '../walks-board.controller';
import { BoardService } from '../walks-board.service';
import { createBoardDto } from '../dtos/create-board.dto';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../auth/dtos/user.dto';
import { KafkaService } from '../../kafka/kafka.walks-push.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardRepository } from '../repositories/walks-board.repository';

describe('BoardController (walksBoard)', () => {
  let controller: Boardcontroller;
  let boardService: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'dev' ? 'dev.env' : 'prod.env',
        }),
      ],
      controllers: [Boardcontroller],
      providers: [
        BoardService,
        KafkaService,
        ConfigService,
        BoardRepository, // 이 부분에 BoardRepository를 추가해야 함
      ],
    }).compile();

    controller = module.get<Boardcontroller>(Boardcontroller);
    boardService = module.get<BoardService>(BoardService);
  });

  it('should create a board', async () => {
    // Mocking boardService.createBoard method
    const mockDto: createBoardDto = {
      userIdx: 1,
      title: "오늘 오후 보라메 공원에서 산책하실 분 구합니다!",
      description: "보라메 공원에서 함께 산책할 분을 찾습니다. 자세한 내용은 아래와 같습니다.",
      location: "보라메 공원",
      places: "보라메 공원 지도 위치",
      meetingDatetime: new Date("2023-06-13T14:00:00.000Z"),
      maxParticipants: 8,
      thumbnail: "https://dogspot.s3.ap-northeast-2.amazonaws.com/board/20230629233511-42b37a7f-20d1-43f3-8615-9cb01e8ac99d-N1.jpeg",
    };
    const mockUser: User = {
      idx: 1,
      nickname: 'testuser',
      email: 'test@example.com',
      profilePath: null,
      loginMethod: null,
      // 필요에 따라 추가 필드를 채워넣으세요.
    };
    const mockResult = 'mockResult'; // Replace with expected result from createBoard

    jest.spyOn(boardService, 'createBoard').mockResolvedValue(undefined);

    // Mocking request and response objects
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };


    // Execute the controller method
    await controller.createBoard(res, mockDto, mockUser);

    // Assertion
    expect(boardService.createBoard).toHaveBeenCalledWith(mockDto, mockUser.idx);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith({  });
  });

  // Add more test cases as needed
});
