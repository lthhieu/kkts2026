import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from 'src/configs/transform.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(port ?? 8000);
}
bootstrap();
