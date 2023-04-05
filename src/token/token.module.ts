import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import {
  DEFAULT_JWT_AUDIENCE,
  DEFAULT_JWT_EXPIRY,
  DEFAULT_JWT_ISSUER,
  DEFAULT_JWT_MAX_AGE,
  DEFAULT_JWT_SECRET,
} from '@constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: DEFAULT_JWT_SECRET,
      signOptions: {
        expiresIn: DEFAULT_JWT_EXPIRY,
        audience: DEFAULT_JWT_AUDIENCE,
        issuer: DEFAULT_JWT_ISSUER,
      },
      verifyOptions: {
        audience: DEFAULT_JWT_AUDIENCE,
        issuer: DEFAULT_JWT_ISSUER,
        maxAge: DEFAULT_JWT_MAX_AGE || '10s',
      },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
