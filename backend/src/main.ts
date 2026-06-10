import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir comunicação com o frontend
  app.enableCors();

  // Configura prefixo global para as rotas da API (ex: http://localhost:3000/api/usuarios)
  app.setGlobalPrefix('api');

  // Habilita validação automática global para dados de entrada (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
