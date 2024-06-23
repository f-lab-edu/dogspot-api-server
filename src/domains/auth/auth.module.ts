import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt/refresh-token.strategy';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? 'env.dev' : 'env.prod',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, JwtRefreshTokenStrategy, UserRepository],
  exports: [PassportModule, JwtModule, JwtStrategy, JwtRefreshTokenStrategy], // ?: JwtStrategy, PassportModule, JwtRefreshTokenStrategy은 왜 export를 하는건지
})
export class AuthModule {}
