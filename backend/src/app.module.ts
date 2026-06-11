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

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    PrismaModule, 
    AuthModule, 
    UsuariosModule, 
    PresidentesModule, 
    SlidesModule,
    QuemSomosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
