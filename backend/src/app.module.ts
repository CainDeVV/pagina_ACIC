import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PresidentesModule } from './modules/presidentes/presidentes.module';
import { SlidesModule } from './modules/slides/slides.module';
import { QuemSomosModule } from './modules/quem-somos/quem-somos.module';
import { ServicosModule } from './modules/servicos/servicos.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { DiretoriaModule } from './modules/diretoria/diretoria.module';
import { UploadModule } from './modules/upload/upload.module';
import { NoticiasModule } from './modules/noticias/noticias.module';
import { AssociadosModule } from './modules/associados/associados.module';
import { InscricoesModule } from './modules/inscricoes/inscricoes.module';
import { CertificadosModule } from './modules/certificados/certificados.module';
import { PatrocinadoresModule } from './modules/patrocinadores/patrocinadores.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    PresidentesModule,
    SlidesModule,
    QuemSomosModule,
    ServicosModule,
    EventosModule,
    DiretoriaModule,
    UploadModule,
    NoticiasModule,
    AssociadosModule,
    InscricoesModule,
    CertificadosModule,
    PatrocinadoresModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
