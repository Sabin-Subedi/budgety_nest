import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.DEFAULT_JWT_SECRET || 'jwt-secret',
      signOptions: {
        expiresIn: process.env.DEFAULT_JWT_EXPIRY || '10s',
        audience: process.env.DEFAULT_JWT_AUDIENCE || 'budgety-audience',
        issuer: process.env.DEFAULT_JWT_ISSUER || 'budgety-issuer',
      },
      verifyOptions: {
        audience: process.env.DEFAULT_JWT_AUDIENCE || 'budgety-audience',
        issuer: process.env.DEFAULT_JWT_ISSUER || 'budgety-issuer',
        maxAge: process.env.DEFAULT_JWT_MAX_AGE || '10s',
      },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
