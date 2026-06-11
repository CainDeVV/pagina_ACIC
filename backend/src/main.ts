import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // --- CONFIGURAÇÃO DA PÁGINA VISUAL DO SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API ACIC')
    .setDescription('Documentação dos endpoints do painel administrativo ACIC')
    .setVersion('1.0')
    .addBearerAuth() // Deixa pronto o campo de Token JWT para o login do Cainã
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
