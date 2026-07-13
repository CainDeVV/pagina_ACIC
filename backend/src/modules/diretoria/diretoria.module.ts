import { Module } from '@nestjs/common';
import { DiretoriaService } from './diretoria.service';
import { DiretoriaController } from './diretoria.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiretoriaController],
  providers: [DiretoriaService],
})
export class DiretoriaModule {}
