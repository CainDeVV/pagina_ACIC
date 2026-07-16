import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PublishStatus } from '@prisma/client';

describe('HomeService', () => {
  let service: HomeService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  describe('getDestaques', () => {
    it('deve buscar e agregar todos os dados com ordenação exata (BFF)', async () => {
      // Configurar retornos mockados
      prisma.homeSlide.findMany.mockResolvedValue([{ id: 's1' }] as any);
      prisma.servico.findMany.mockResolvedValue([{ id: 'se1' }] as any);
      prisma.diretor.findMany.mockResolvedValue([{ id: 'd1' }] as any);

      // Mock de eventos: retorna 2 futuros e 2 passados
      prisma.evento.findMany
        .mockResolvedValueOnce([{ id: 'ev1' }, { id: 'ev2' }] as any) // próximos
        .mockResolvedValueOnce([{ id: 'ev_p1' }, { id: 'ev_p2' }] as any); // passados

      prisma.noticia.findMany.mockResolvedValue([{ id: 'n1' }] as any);

      const result = await service.getDestaques();

      // Checa Slide
      expect(prisma.homeSlide.findMany).toHaveBeenCalledWith({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });

      // Checa Serviço
      expect(prisma.servico.findMany).toHaveBeenCalledWith({
        where: { status: PublishStatus.PUBLISHED, destaque: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 6,
      });

      // Checa Diretoria
      expect(prisma.diretor.findMany).toHaveBeenCalledWith({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        take: 4,
      });

      // Checa Fallback de Eventos (limitado a 3 no total)
      // Tinha 2 futuros + 2 passados = deve mesclar e retornar 3
      expect(result.data.eventos).toHaveLength(3);
      expect(result.data.eventos.map((e) => (e as any).id)).toEqual([
        'ev1',
        'ev2',
        'ev_p1',
      ]);

      expect(result.data.slides).toHaveLength(1);
      expect(result.data.servicos).toHaveLength(1);
      expect(result.data.diretoria).toHaveLength(1);
      expect(result.data.noticias).toHaveLength(1);
    });

    it('não deve incluir eventos passados se houver >= 3 eventos futuros', async () => {
      // Mock de eventos: retorna 3 futuros
      prisma.homeSlide.findMany.mockResolvedValue([]);
      prisma.servico.findMany.mockResolvedValue([]);
      prisma.diretor.findMany.mockResolvedValue([]);

      prisma.evento.findMany
        .mockResolvedValueOnce([
          { id: 'ev1' },
          { id: 'ev2' },
          { id: 'ev3' },
        ] as any) // próximos
        .mockResolvedValueOnce([{ id: 'ev_p1' }] as any); // passados

      prisma.noticia.findMany.mockResolvedValue([]);

      const result = await service.getDestaques();

      expect(result.data.eventos).toHaveLength(3);
      expect(result.data.eventos.map((e) => (e as any).id)).toEqual([
        'ev1',
        'ev2',
        'ev3',
      ]);
    });
  });
});
