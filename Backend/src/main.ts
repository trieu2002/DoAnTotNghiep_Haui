import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './core/http-exception.filter';
import  cookieParser from 'cookie-parser';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const reflector=app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(cookieParser());
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe({
     whitelist:true
  }))
  
  app.enableCors({
    origin: 'http://localhost:3000', // Thay đổi thành origin của ứng dụng frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
   
  });
  const configService=app.get(ConfigService);
  const PORT=configService.get<number>('PORT');
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type:VersioningType.URI,
    defaultVersion:['1','2']
  });
  app.use(helmet())
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT);
}
bootstrap();
