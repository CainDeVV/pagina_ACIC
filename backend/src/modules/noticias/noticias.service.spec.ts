import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { PublishStatus, Prisma } from '@prisma/client';

describe('NoticiasService', () => {
  let service: NoticiasService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticiasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NoticiasService>(NoticiasService);
  });

  describe('create', () => {
    it('deve gerar slug a partir do titulo e conectar categorias', async () => {
      const dto: CreateNoticiaDto = {
        title: 'Nova Notícia',
        content: { blocks: [] },
        categoriasIds: ['c1'],
      };

      prisma.noticia.create.mockResolvedValue({ slug: 'nova-noticia' } as any);

      await service.create(dto, 'user1');

      expect(prisma.noticia.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Nova Notícia',
          slug: 'nova-noticia',
          authorId: 'user1',
          categorias: { connect: [{ id: 'c1' }] },
        }),
      });
    });
  });

  describe('findAllPublic', () => {
    it('deve omitir DRAFTs e considerar publishedAt', async () => {
      prisma.noticia.findMany.mockResolvedValue([]);
      prisma.noticia.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 1, limit: 10 });

      expect(prisma.noticia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: PublishStatus.PUBLISHED,
            AND: expect.arrayContaining([
              {
                OR: [
                  { publishedAt: null },
                  { publishedAt: { lte: expect.any(Date) } },
                ],
              },
            ]),
          }),
        }),
      );
    });

    it('deve compilar os filtros avançados de busca (search) e categorias (categoriasIds)', async () => {
      prisma.noticia.findMany.mockResolvedValue([]);
      prisma.noticia.count.mockResolvedValue(0);

      await service.findAllPublic({
        page: 1,
        limit: 10,
        search: 'teste',
        categoriasIds: ['c1', 'c2'],
      });

      expect(prisma.noticia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: PublishStatus.PUBLISHED,
            AND: expect.arrayContaining([
              {
                OR: [
                  { title: { contains: 'teste', mode: 'insensitive' } },
                  { summary: { contains: 'teste', mode: 'insensitive' } },
                ],
              },
            ]),
            categorias: { some: { id: { in: ['c1', 'c2'] } } },
          }),
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve listar notícias sem filtros restritos e respeitando paginação', async () => {
      prisma.noticia.findMany.mockResolvedValue([]);
      prisma.noticia.count.mockResolvedValue(0);

      await service.findAllAdmin({ page: 2, limit: 5 });

      expect(prisma.noticia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: { publishedAt: 'desc' },
        }),
      );
      // Deve garantir que não há filtro de 'status' forçado
      const whereArg = prisma.noticia.findMany.mock.calls[0][0]?.where as any;
      expect(whereArg?.status).toBeUndefined();
    });
  });

  describe('findBySlug', () => {
    it('deve lançar erro se publicado no futuro', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      prisma.noticia.findUnique.mockResolvedValue({
        id: '1',
        slug: 'teste',
        status: PublishStatus.PUBLISHED,
        publishedAt: futureDate,
      } as any);

      await expect(service.findBySlug('teste')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar se publicado e data no passado', async () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const mockNoticia = {
        id: '1',
        slug: 'teste',
        status: PublishStatus.PUBLISHED,
        publishedAt: pastDate,
      } as any;

      prisma.noticia.findUnique.mockResolvedValue(mockNoticia);
      const result = await service.findBySlug('teste');
      expect(result).toEqual(mockNoticia);
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se a notícia não existir (Caminho Triste)', async () => {
      prisma.noticia.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('deve buscar estritamente por ID sem filtros adicionais (Caminho Feliz)', async () => {
      const mockResult = { id: '1', title: 'Teste' } as any;
      prisma.noticia.findUnique.mockResolvedValue(mockResult);

      const result = await service.findOne('1');

      expect(prisma.noticia.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          author: { select: { name: true, email: true } },
          categorias: true,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('não deve setar categorias se array não for passado', async () => {
      prisma.noticia.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.noticia.update.mockResolvedValue({} as any);

      await service.update('1', { title: 'T2' });

      const updateArgs = prisma.noticia.update.mock.calls[0][0];
      expect(updateArgs.data.categorias).toBeUndefined();
      expect(updateArgs.data.slug).toBe('t2'); // Slug recriado
    });

    it('deve atualizar repassando a instrução { set: [{ id }] } se categoriasIds for passado', async () => {
      prisma.noticia.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.noticia.update.mockResolvedValue({} as any);

      await service.update('1', { categoriasIds: ['c1', 'c2'] });

      const updateArgs = prisma.noticia.update.mock.calls[0][0];
      expect(updateArgs.data.categorias).toEqual({
        set: [{ id: 'c1' }, { id: 'c2' }],
      });
    });
  });

  describe('remove', () => {
    it('deve buscar e estourar NotFound antes do delete (Caminho Triste)', async () => {
      prisma.noticia.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(prisma.noticia.delete).not.toHaveBeenCalled();
    });

    it('deve realizar a deleção após encontrar a notícia (Caminho Feliz)', async () => {
      const mockResult = { id: '1' } as any;
      prisma.noticia.findUnique.mockResolvedValue(mockResult);
      prisma.noticia.delete.mockResolvedValue(mockResult);

      await service.remove('1');

      expect(prisma.noticia.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
