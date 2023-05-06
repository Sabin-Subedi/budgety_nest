import {
  BASE_OAUTH_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} from '@constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthProvider } from '@prisma/client';
import { Profile, Strategy } from 'passport-facebook';
import { generateUsernameWithPrefix } from 'src/utils/default';
import { CreateOauthDto } from '../dto/create-oauth.dto';
import { OauthService } from '../oauth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly oauthService: OauthService) {
    super({
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: BASE_OAUTH_URL + 'facebook/',

      profileFields: ['id', 'email', 'name', 'displayName', 'photos'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const fProfile = profile._json;
      if (!fProfile.email || !fProfile.id) {
        throw new UnauthorizedException('Invalid facebook profile');
      }
      const val = new CreateOauthDto({
        email: fProfile.email || '',
        name: fProfile.name || '',
        username: generateUsernameWithPrefix(fProfile.name) || '',
        OAuthProvider: OAuthProvider.FACEBOOK,
        OAuthProviderId: fProfile.id,
      });

      return await this.oauthService.findOrCreateUserByOauth(val);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
