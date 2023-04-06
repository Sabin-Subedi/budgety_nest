import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { redisStore } from 'cache-manager-redis-store';
import { REDIS_URL } from './constant/env';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore as unknown as CacheStore,
        url: REDIS_URL,
        ttl: 60 * 60 * 24,
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
