import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-store';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import type { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_URL,
  REDIS_USER,
  REDIS_USER_PWD,
} from './constant/env';
import { DataModule } from './data/data.module';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './roles/roles.guard';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { TokenModule } from './token/token.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
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
    BullModule.forRoot({
      redis: {
        password: REDIS_USER_PWD,
        tls: {
          requestCert: true,
          rejectUnauthorized: true,
          host: REDIS_HOST,
          port: +REDIS_PORT,
          timeout: 1000,
          secureOptions: 2,
        },
        showFriendlyErrorStack: true,
        connectTimeout: 1000,
        offlineQueue: false,
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    CategoriesModule,
    RolesModule,
    TransactionModule,
    MailModule,
    DataModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    PrismaService,
    RolesService,
  ],
})
export class AppModule {}
