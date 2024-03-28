import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // IMPORTANT: Trims extra properties from the body for security purpose
    }),
  );
  app.use(
    cookieSession({
      keys: ['asadasdewwecfsd'], // NOTE: Random string to encrypt cookies
    }),
  );
  await app.listen(3000);
}
bootstrap();
