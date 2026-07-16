import { Test, TestingModule } from '@nestjs/testing';
import { DiretoriaController } from './diretoria.controller';
import { DiretoriaService } from './diretoria.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDiretoriaDto } from './dto/create-diretoria.dto';
import { UpdateDiretoriaDto } from './dto/update-diretoria.dto';

describe('DiretoriaController', () => {
  let controller: DiretoriaController;
  let service: DeepMockProxy<DiretoriaService>;

  beforeEach(async () => {
    service = mockDeep<DiretoriaService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiretoriaController],
      providers: [{ provide: DiretoriaService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DiretoriaController>(DiretoriaController);
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

  describe('findOne', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '99', name: 'Diretor' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOne('99');

      expect(service.findOne).toHaveBeenCalledWith('99');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar Payload para create', async () => {
      const createDto: CreateDiretoriaDto = {
        name: 'Novo Diretor',
        role: 'Conselho',
        category: 'Conselho',
      };
      const mockResult = { id: '1', ...createDto } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const updateDto: UpdateDiretoriaDto = { name: 'Atualizado' };
      const mockResult = { id: '1', name: 'Atualizado' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', name: 'Removido' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
