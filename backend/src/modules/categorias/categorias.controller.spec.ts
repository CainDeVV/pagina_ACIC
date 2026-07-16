import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let service: DeepMockProxy<CategoriasService>;

  beforeEach(async () => {
    service = mockDeep<CategoriasService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [{ provide: CategoriasService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriasController>(CategoriasController);
  });

  describe('findActive', () => {
    it('deve chamar findActive do service', async () => {
      const mockResult = [{ id: '1', name: 'Ativa' }] as any;
      service.findActive.mockResolvedValueOnce(mockResult);

      const result = await controller.findActive();

      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllAdmin', () => {
    it('deve repassar DTO de paginação para findAll', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
      service.findAll.mockResolvedValueOnce(mockResult as any);

      const paginationDto = { page: 2, limit: 15 };
      const result = await controller.findAllAdmin(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneAdmin', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '99', name: 'Tag' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOneAdmin('99');

      expect(service.findOne).toHaveBeenCalledWith('99');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar Payload para create', async () => {
      const createDto: CreateCategoriaDto = { name: 'Nova Tag', active: true };
      const mockResult = { id: '1', ...createDto } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const updateDto: UpdateCategoriaDto = { name: 'Atualizada' };
      const mockResult = { id: '1', name: 'Atualizada' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', name: 'Removida' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
