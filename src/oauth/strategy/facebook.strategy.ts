import {
  BASE_OAUTH_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} from '@constants';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: BASE_OAUTH_URL + 'facebook/',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return { profile, accessToken, refreshToken };
  }
}
