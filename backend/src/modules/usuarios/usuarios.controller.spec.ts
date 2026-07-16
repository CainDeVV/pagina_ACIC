import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: DeepMockProxy<UsuariosService>;

  beforeEach(async () => {
    service = mockDeep<UsuariosService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  describe('create', () => {
    it('deve repassar Payload para create', async () => {
      const dto: CreateUsuarioDto = {
        name: 'Admin',
        email: 'admin@a.com',
        password: '123',
      };
      const mockResult = { id: '1', name: 'Admin' } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('deve chamar findAll sem paginacao', async () => {
      const mockResult = [{ id: '1' }] as any;
      service.findAll.mockResolvedValueOnce(mockResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '1', name: 'A' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const dto: UpdateUsuarioDto = { name: 'B' };
      const mockResult = { id: '1', name: 'B' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', name: 'A' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
