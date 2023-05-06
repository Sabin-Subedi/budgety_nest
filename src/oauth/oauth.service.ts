import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'nestjs-prisma';
import { USER_CREATED } from 'src/constant/events';
import { CreateOauthDto } from './dto/create-oauth.dto';

@Injectable()
export class OauthService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
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
    const { OAuthProvider, OAuthProviderId } = oauthMethodData;
    const user = await this.prisma.user.findFirst({
      where: {
        OAuth: {
          some: {
            providerId: OAuthProviderId,
            provider: OAuthProvider,
          },
        },
      },
    });
    if (user) {
      return user;
    }

    return this.createOauth(oauthMethodData);
  }
}
