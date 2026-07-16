import { Test, TestingModule } from '@nestjs/testing';
import { PresidentesController } from './presidentes.controller';
import { PresidentesService } from './presidentes.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';

describe('PresidentesController', () => {
  let controller: PresidentesController;
  let service: DeepMockProxy<PresidentesService>;

  beforeEach(async () => {
    service = mockDeep<PresidentesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresidentesController],
      providers: [{ provide: PresidentesService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PresidentesController>(PresidentesController);
  });

  describe('findAllPublic', () => {
    it('deve repassar o paginationDto para findAllPublic do service', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
      };
      service.findAllPublic.mockResolvedValueOnce(mockResult);

      const dto = { page: 1, limit: 10 };
      const result = await controller.findAllPublic(dto);

      expect(service.findAllPublic).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllAdmin', () => {
    it('deve repassar o paginationDto para findAllAdmin do service', async () => {
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
      };
      service.findAllAdmin.mockResolvedValueOnce(mockResult);

      const dto = { page: 2, limit: 20 };
      const result = await controller.findAllAdmin(dto);

      expect(service.findAllAdmin).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '1', name: 'Pres' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar Payload para create', async () => {
      const dto: CreatePresidenteDto = { name: 'João', termStart: 2020 };
      const mockResult = { id: '1', ...dto } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const dto: UpdatePresidenteDto = { name: 'João Atualizado' };
      const mockResult = { id: '1', name: 'João Atualizado' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', name: 'João' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
