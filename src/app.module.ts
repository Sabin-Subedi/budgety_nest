import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { redisStore } from 'cache-manager-redis-store';
import { REDIS_URL } from './constant/env';
import redis from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,

      // @ts-ignore
      store: async () =>
        await redisStore({
          url: REDIS_URL,
        }),
    }),
    UsersModule,
    AuthModule,
    TokenModule,
  ],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
