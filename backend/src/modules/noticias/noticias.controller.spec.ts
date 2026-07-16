import { Test, TestingModule } from '@nestjs/testing';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { NoticiasController } from './noticias.controller';
import { NoticiasService } from './noticias.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { JwtPayload } from '../../common/interfaces/request-user.interface';

describe('NoticiasController', () => {
  let controller: NoticiasController;
  let service: DeepMockProxy<NoticiasService>;

  beforeEach(async () => {
    service = mockDeep<NoticiasService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiasController],
      providers: [{ provide: NoticiasService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: (context: any, next: any) => next.handle() })
      .compile();

    controller = module.get<NoticiasController>(NoticiasController);
  });

  describe('findAllPublic', () => {
    it('deve repassar o DTO de paginação e retornar o resultado', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
      service.findAllPublic.mockResolvedValueOnce(mockResult);

      const paginationDto = { page: 1, limit: 10 };
      const result = await controller.findAllPublic(paginationDto);

      expect(service.findAllPublic).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findBySlug', () => {
    it('deve repassar o slug e retornar o resultado', async () => {
      const mockResult = { id: '1', slug: 'teste-123' } as any;
      service.findBySlug.mockResolvedValueOnce(mockResult);

      const result = await controller.findBySlug('teste-123');

      expect(service.findBySlug).toHaveBeenCalledWith('teste-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllAdmin', () => {
    it('deve repassar o DTO de paginação na área restrita e retornar o resultado', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
      service.findAllAdmin.mockResolvedValueOnce(mockResult);

      const paginationDto = { page: 2, limit: 20 };
      const result = await controller.findAllAdmin(paginationDto);

      expect(service.findAllAdmin).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneAdmin', () => {
    it('deve repassar o ID na área restrita e retornar o resultado', async () => {
      const mockResult = { id: '99', title: 'Teste' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOneAdmin('99');

      expect(service.findOne).toHaveBeenCalledWith('99');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar o Payload de criação e injetar o ID do usuário através do CurrentUser', async () => {
      const createDto: CreateNoticiaDto = {
        title: 'Nova',
        content: { blocks: [] },
      };

      const fakeUser: JwtPayload = {
        id: 'user-admin-123',
        email: 'admin@acic.com',
        role: 'ADMIN',
      };
      const mockResult = {
        id: '1',
        ...createDto,
        authorId: fakeUser.id,
      } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto, fakeUser);

      expect(service.create).toHaveBeenCalledWith(createDto, 'user-admin-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar o ID e o Payload de atualização', async () => {
      const updateDto: UpdateNoticiaDto = { title: 'Novo Titulo' };
      const mockResult = { id: '1', title: 'Novo Titulo' } as any;
      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar o ID para exclusão', async () => {
      const mockResult = { id: '1', title: 'Removida' } as any;
      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
