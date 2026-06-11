import { Module } from '@nestjs/common';
import { PresidentesService } from './presidentes.service';
import { PresidentesController } from './presidentes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PresidentesController],
  providers: [PresidentesService],
})
export class PresidentesModule {}
