import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class EventosCronService {
  private readonly logger = new Logger(EventosCronService.name);

  constructor(private readonly prisma: PrismaService) { }

  // Roda a cada minuto para verificar se há eventos agendados
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledEvents() {
    const agora = new Date();

    try {
      const result = await this.prisma.evento.updateMany({
        where: {
          status: PublishStatus.DRAFT,
          publishedAt: {
            lte: agora,
          },
        },
        data: {
          status: PublishStatus.PUBLISHED,
        },
      });

      if (result.count > 0) {
        this.logger.log(`Publicação Automática (Cron): ${result.count} evento(s) publicado(s) com sucesso.`);
      }
    } catch (error) {
      this.logger.error('Erro ao executar o cron de agendamento de eventos', error);
    }
  }
}
