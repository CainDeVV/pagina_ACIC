import { Test, TestingModule } from '@nestjs/testing';
import { QuemSomosController } from './quem-somos.controller';
import { QuemSomosService } from './quem-somos.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';
import { PublishStatus } from '@prisma/client';

describe('QuemSomosController', () => {
  let controller: QuemSomosController;
  let service: DeepMockProxy<QuemSomosService>;

  beforeEach(async () => {
    service = mockDeep<QuemSomosService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuemSomosController],
      providers: [{ provide: QuemSomosService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<QuemSomosController>(QuemSomosController);
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

  describe('findOnePublic', () => {
    it('deve repassar a chave flexível e retornar o resultado', async () => {
      const mockResult = { id: '1', key: 'cmec', title: 'CMEC' } as any;
      service.findOnePublic.mockResolvedValueOnce(mockResult);

      const result = await controller.findOnePublic('cmec');

      expect(service.findOnePublic).toHaveBeenCalledWith('cmec');
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
      const mockResult = { id: '99', key: 'teste', title: 'Teste' } as any;
      service.findOneAdmin.mockResolvedValueOnce(mockResult);

      const result = await controller.findOneAdmin('99');

      expect(service.findOneAdmin).toHaveBeenCalledWith('99');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar o Payload de criação', async () => {
      const createDto: CreateQuemSomosDto = {
        key: 'estatuto',
        title: 'Estatuto',
        content: { blocks: [] },
      };
      const mockResult = {
        id: '1',
        ...createDto,
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar o ID e o Payload de atualização', async () => {
      const updateDto: UpdateQuemSomosDto = { title: 'Novo Titulo' };
      const mockResult = {
        id: '1',
        key: 'estatuto',
        title: 'Novo Titulo',
      } as any;
      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar o ID para exclusão', async () => {
      const mockResult = { id: '1', key: 'estatuto', title: 'Estatuto' } as any;
      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
