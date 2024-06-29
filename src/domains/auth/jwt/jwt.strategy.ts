import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findUserByIdx(payload.userIdx);
    if (!user) {
      throw new UnauthorizedException({
        errorCode: 'EXPIRED_ACCESS_TOKEN',
        message: '액세스 토큰이 만료되었습니다.',
      }); // 액세스 토큰 만료. 재발급 필요
    }
    return user;
  }
}
