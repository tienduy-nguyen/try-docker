import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from 'src/common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(1776, () =>
    console.log('Serve is running at http://localhost:1776/api/docs'),
  );
}
bootstrap();
