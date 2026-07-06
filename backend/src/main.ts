import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

async function bootstrap() {
  // Inicializamos o NestJS com a tipagem específica do Express
  // para termos acesso ao método useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Injeta o Tratamento Global de Erros de Banco de Dados
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Escudo de segurança para os Headers HTTP (Contra XSS e afins)
  app.use(helmet({ crossOriginResourcePolicy: false })); // Permite servir imagens no Frontend

  // Habilita CORS estrito (Apenas o seu Frontend tem a chave)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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
    .addBearerAuth() // Deixa pronto o campo de Token JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configura o NestJS para servir arquivos estáticos da pasta "uploads"
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
