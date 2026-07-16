import { Test, TestingModule } from '@nestjs/testing';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { UserRole } from '@prisma/client';

describe('ServicosController', () => {
  let controller: ServicosController;
  let service: DeepMockProxy<ServicosService>;

  beforeEach(async () => {
    service = mockDeep<ServicosService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [{ provide: ServicosService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: (context: any, next: any) => next.handle() })
      .compile();

    controller = module.get<ServicosController>(ServicosController);
  });

  describe('findAllPublic', () => {
    it('deve repassar DTO de paginação para findAllPublic', async () => {
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
    it('deve repassar o slug para findBySlug', async () => {
      const mockResult = { id: '1', slug: 'teste' } as any;
      service.findBySlug.mockResolvedValueOnce(mockResult);

      const result = await controller.findBySlug('teste');

      expect(service.findBySlug).toHaveBeenCalledWith('teste');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllAdmin', () => {
    it('deve repassar DTO de paginação para findAllAdmin', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
      service.findAllAdmin.mockResolvedValueOnce(mockResult);

      const paginationDto = { page: 2, limit: 15 };
      const result = await controller.findAllAdmin(paginationDto);

      expect(service.findAllAdmin).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneAdmin', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '99', title: 'Servico' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOneAdmin('99');

      expect(service.findOne).toHaveBeenCalledWith('99');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar Payload e authorId para create', async () => {
      const createDto: CreateServicoDto = {
        title: 'Novo Servico',
        description: {} as any,
      };
      const mockUser: JwtPayload = {
        id: 'user-123',
        email: 'test@test.com',
        role: UserRole.EDITOR,
      };
      const mockResult = { id: '1', ...createDto, authorId: 'user-123' } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto, mockUser);

      expect(service.create).toHaveBeenCalledWith(createDto, 'user-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const updateDto: UpdateServicoDto = { title: 'Atualizado' };
      const mockResult = { id: '1', title: 'Atualizado' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', title: 'Removido' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
