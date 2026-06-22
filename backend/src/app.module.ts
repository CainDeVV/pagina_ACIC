import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
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

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
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
    NoticiasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
