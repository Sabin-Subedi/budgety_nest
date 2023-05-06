import {
  BASE_OAUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE,
} from '@constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: BASE_OAUTH_URL + 'google/',
      scope: GOOGLE_SCOPE,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      return { profile, accessToken, refreshToken };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
