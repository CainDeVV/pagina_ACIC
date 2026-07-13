import { Module } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NoticiasController],
  providers: [NoticiasService],
  exports: [NoticiasService],
})
export class NoticiasModule {}
