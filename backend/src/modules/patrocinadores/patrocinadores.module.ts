import { Module } from '@nestjs/common';
import { PatrocinadoresService } from './patrocinadores.service';
import { PatrocinadoresController } from './patrocinadores.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatrocinadoresController],
  providers: [PatrocinadoresService],
})
export class PatrocinadoresModule {}
