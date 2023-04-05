import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from '@constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  signAccessToken(payload: Record<string, string>) {
    return this.jwtService.signAsync(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  signRefreshToken(payload: Record<string, string>) {
    return this.jwtService.signAsync(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  async signTokenPair(payload: Record<string, string>) {
    const access_token = await this.signAccessToken(payload);
    const refresh_token = await this.signRefreshToken(payload);
    return {
      access_token,
      refresh_token,
    };
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: REFRESH_TOKEN_SECRET,
    });
  }
}
