import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { USER_CREATED } from 'src/constant/events';
import { TokenService } from 'src/token/token.service';
import { CreateOauthDto } from './dto/create-oauth.dto';

@Injectable()
export class OauthService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private tokenService: TokenService,
  ) {}
  async createOauth(createOauthDto: CreateOauthDto) {
    const { OAuthProvider, OAuthProviderId, ...extraData } = createOauthDto;

    const oAuthUser = await this.prisma.user.create({
      data: {
        ...extraData,
        OAuth: {
          create: {
            providerId: OAuthProviderId,
            provider: OAuthProvider,
          },
        },
      },
    });

    this.eventEmitter.emit(USER_CREATED, oAuthUser);

    return oAuthUser;
  }
  async findOrCreateUserByOauth(oauthMethodData: CreateOauthDto) {
    let user: User | null = null;
    const { OAuthProvider, OAuthProviderId } = oauthMethodData;
    user = await this.prisma.user.findFirst({
      where: {
        OAuth: {
          some: {
            providerId: OAuthProviderId,
            provider: OAuthProvider,
          },
        },
      },
    });
    if (!user) {
      user = await this.createOauth(oauthMethodData);
    }

    const tokenPair = await this.tokenService.signTokenPair({
      sub: user.id,
      email: user.email,
    });

    return tokenPair;
  }
}
