import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDestaques() {
    const agora = new Date();

    const [
      slides,
      servicos,
      diretoria,
      proximosEventos,
      eventosPassados,
      noticias,
    ] = await Promise.all([
      // 1. SLIDES: Todos publicados e ordenados
      this.prisma.homeSlide.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: { sortOrder: 'asc' },
      }),

      // 2. SERVIÇOS: Apenas os 6 primeiros publicados E em destaque
      this.prisma.servico.findMany({
        where: { status: PublishStatus.PUBLISHED, destaque: true },
        orderBy: { sortOrder: 'asc' },
        take: 6,
      }),

      // 3. DIRETORIA: Pega apenas os 4 primeiros ordenados (sem agrupamento, ideal para Home)
      this.prisma.diretor.findMany({
        orderBy: { sortOrder: 'asc' },
        take: 4,
      }),

      // 4. EVENTOS (PRÓXIMOS): Publicados, data maior que hoje e nao cancelados
      this.prisma.evento.findMany({
        where: {
          status: PublishStatus.PUBLISHED,
          startsAt: { gt: agora },
          NOT: {
            OR: [
              {
                status: 'FINISHED',
              }, // Proteção caso o enum não tenha finished
              {
                status: 'CANCELLED',
              },
            ],
          },
        },
        orderBy: { startsAt: 'asc' },
        take: 3,
      }),

      // 4.5 EVENTOS (PASSADOS, FALBBACK): Caso não haja próximos eventos
      this.prisma.evento.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: { startsAt: 'desc' },
        take: 3,
      }),

      // 5. NOTICIAS: Apenas as 3 mais recentes publicadas
      this.prisma.noticia.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    // Tratar Eventos (Se tiver próximos usa, se não tiver usa os antigos)
    const eventos =
      proximosEventos.length > 0 ? proximosEventos : eventosPassados;

    return {
      data: {
        slides,
        servicos,
        diretoria,
        eventos,
        noticias,
      },
    };
  }
}
