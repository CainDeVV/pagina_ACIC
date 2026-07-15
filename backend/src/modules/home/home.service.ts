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
          status: 'PUBLISHED',
          startsAt: { gt: agora },
          OR: [{ publishedAt: null }, { publishedAt: { lte: agora } }],
        },
        orderBy: { startsAt: 'asc' },
        take: 3,
      }),

      // 4.5 EVENTOS (PASSADOS, FALBBACK): Caso não haja 3 próximos eventos
      this.prisma.evento.findMany({
        where: {
          status: { in: ['PUBLISHED', 'FINISHED'] },
          startsAt: { lte: agora },
          OR: [{ publishedAt: null }, { publishedAt: { lte: agora } }],
        },
        orderBy: { startsAt: 'desc' },
        take: 3,
      }),

      // 5. NOTICIAS: Apenas as 3 mais recentes publicadas
      this.prisma.noticia.findMany({
        where: {
          status: PublishStatus.PUBLISHED,
          OR: [{ publishedAt: null }, { publishedAt: { lte: agora } }],
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
      }),
    ]);

    // Completar com eventos passados se os próximos não preencherem as 3 vagas
    const proximosIds = proximosEventos.map((e) => e.id);
    const eventosPassadosFiltrados = eventosPassados.filter(
      (e) => !proximosIds.includes(e.id),
    );
    const eventos = [...proximosEventos, ...eventosPassadosFiltrados].slice(
      0,
      3,
    );

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
