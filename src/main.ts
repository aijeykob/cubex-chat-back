import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';
import { AppModule } from './app.module';
import { CORS_OPTIONS } from './utils/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(CORS_OPTIONS);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(
    `[Cubex-back-end] Listening on port ${port} on ${await app.getUrl()}`,
  );
}
bootstrap();
