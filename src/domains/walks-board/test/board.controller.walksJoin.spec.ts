import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../walks-board.service';
import { boardJoinDto } from '../dtos/board-join';
import { User } from '../../auth/dtos/user.dto';
import { Boardcontroller } from '../walks-board.controller';
import { StatusCodes } from 'http-status-codes';
import { BoardRepository } from '../repositories/walks-board.repository';
import { KafkaService } from '../../kafka/kafka.walks-push.service';
import { ConfigModule, ConfigService } from '@nestjs/config';


describe('BoardController', () => {
  let controller: Boardcontroller;
  let service: BoardService;

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
    service = module.get<BoardService>(BoardService);
  });

  describe('walksJoin', () => {
    it('should join a walk board', async () => {
      const mockDto: boardJoinDto = {
        idx: 1, // 예시로 숫자 1을 넣었지만, 실제 필드 타입에 맞게 수정하세요.
        userDto: {
          idx: 1,
          nickname: 'testuser',
          email: 'test@example.com',
          profilePath: null,
          loginMethod: null,
          // 필요에 따라 추가 필드를 채워넣으세요.
        },
      };
      const mockUser: User = {
        idx: 1,
        nickname: 'testuser',
        email: 'test@example.com',
        profilePath: null,
        loginMethod: null,
        // 필요에 따라 추가 필드를 채워넣으세요.
      };

      jest.spyOn(service, 'walksJoin').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.walksJoin(res, mockDto, mockUser);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith({});
    });

    it('should handle errors', async () => {
      const mockDto: boardJoinDto = {
        idx: 1, // 예시로 숫자 1을 넣었지만, 실제 필드 타입에 맞게 수정하세요.
        userDto: {
          idx: 1,
          nickname: 'testuser',
          email: 'test@example.com',
          profilePath: null,
          loginMethod: null,
          // 필요에 따라 추가 필드를 채워넣으세요.
        },
      };
      const mockUser: User = {
        idx: 1,
        nickname: 'testuser',
        email: 'test@example.com',
        profilePath: null,
        loginMethod: null,
        // 필요에 따라 추가 필드를 채워넣으세요.
      };
      const mockError = new Error('Mock error');

      jest.spyOn(service, 'walksJoin').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.walksJoin(res, mockDto, mockUser);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({ result: 'Mock error' });
    });
  });
});
