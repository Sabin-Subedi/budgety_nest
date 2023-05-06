import {
  BASE_OAUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE,
} from '@constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthProvider } from '@prisma/client';
import { Profile, Strategy } from 'passport-google-oauth20';
import { generateUsernameWithPrefix } from 'src/utils/default';
import { CreateOauthDto } from '../dto/create-oauth.dto';
import { OauthService } from '../oauth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly oauthService: OauthService) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: BASE_OAUTH_URL + 'google/',
      scope: GOOGLE_SCOPE,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const gProfile = profile._json;

      const val = new CreateOauthDto({
        email: gProfile.email,
        name: gProfile.name,
        username: generateUsernameWithPrefix(gProfile.name),
        OAuthProvider: OAuthProvider.GOOGLE,
        OAuthProviderId: gProfile.sub,
      });

      return this.oauthService.findOrCreateUserByOauth(val);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
