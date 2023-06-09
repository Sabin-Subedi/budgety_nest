import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { join } from 'path';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ResponseInterceptor } from './response/response.interceptor';
import { APP_PORT } from './constant/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.use(logger);
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'public', 'templates'));
  app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Budgety API')
    .setDescription('The Budgety API description')
    .setVersion('1.0')
    .addTag('budgety')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(APP_PORT || 3000);
}
bootstrap();
