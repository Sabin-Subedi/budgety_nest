import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-store';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import type { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASSWORD,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_USER,
  REDIS_URL,
} from './constant/env';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './roles/roles.guard';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { TokenModule } from './token/token.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';

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
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: EMAIL_SMTP_HOST,
          port: EMAIL_SMTP_PORT,
          secure: true,
          auth: {
            user: EMAIL_SMTP_USER,
            pass: EMAIL_SMTP_PASSWORD,
          },
        },
        defaults: {
          from: 'No Reply <sendgrid_from_email_address>',
        },
        template: {
          adapter: new PugAdapter(),
          dir: join(__dirname, '../..', 'public', 'templates'),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    CategoriesModule,
    RolesModule,
    TransactionModule,
    MailModule,
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
