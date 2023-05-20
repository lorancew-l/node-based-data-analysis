import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Node based data analysis API')
  .setDescription('Node based data analysis API description')
  .setVersion('1.0')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb' }));

  await app.listen(3000);
}

bootstrap();
