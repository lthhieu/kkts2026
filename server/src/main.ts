import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from 'src/configs/transform.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  //versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  //validation
  app.useGlobalPipes(new ValidationPipe());

  //interceptor  
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //global jwt guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  //cookies
  app.use(cookieParser());

  //request entity too large
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  //public folder
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(port ?? 8000);
}
bootstrap();
