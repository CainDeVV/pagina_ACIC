import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventosCronService } from './eventos-cron.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventosController],
  providers: [EventosService, EventosCronService],
  exports: [EventosService],
})
export class EventosModule {}
