import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const OAuthGuard = (type: string | string[]) => {
  @Injectable()
  class OAuthGuard extends AuthGuard(type) {
    handleRequest(err: any, user: any, info: any) {
      if (err || !user) {
        throw new UnauthorizedException(err?.message);
      }
      return user;
    }
  }
  return OAuthGuard;
};
