import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  BLACKLIST_TOKEN_INITIAL,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from '@constants';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenService {
  private blacklistTokenInitial = BLACKLIST_TOKEN_INITIAL || 'bl';
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

  checkIfTokenIsInBlacklist(token: string): Promise<string> {
    return this.cacheManager.get<string>(
      `${this.blacklistTokenInitial}__${token}`,
    );
  }

  setTokenInBlacklist(token: string, ttl?: number) {
    return this.cacheManager.set(
      `${this.blacklistTokenInitial}__${token}`,
      token,
      ttl ? ttl * 1000 : 0,
    );
  }
}
