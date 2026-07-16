import { Test, TestingModule } from '@nestjs/testing';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

describe('SlidesController', () => {
  let controller: SlidesController;
  let service: DeepMockProxy<SlidesService>;

  beforeEach(async () => {
    service = mockDeep<SlidesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlidesController],
      providers: [{ provide: SlidesService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SlidesController>(SlidesController);
  });

  describe('findAllPublic', () => {
    it('deve repassar paginationDto para findAllPublic', async () => {
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
    it('deve repassar paginationDto para findAllAdmin', async () => {
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

  describe('findOneAdmin', () => {
    it('deve repassar o ID para findOne', async () => {
      const mockResult = { id: '1', title: 'T1' } as any;
      service.findOne.mockResolvedValueOnce(mockResult);

      const result = await controller.findOneAdmin('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('deve repassar Payload e authorId do usuario para create', async () => {
      const dto: CreateSlideDto = { title: 'T1', imageUrl: 'url' };
      const user = { id: 'user1', email: 'a@a.com', roles: [] };
      const mockResult = { id: '1', ...dto, authorId: 'user1' } as any;

      service.create.mockResolvedValueOnce(mockResult);

      const result = await controller.create(dto, user as any);

      expect(service.create).toHaveBeenCalledWith(dto, 'user1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve repassar ID e Payload para update', async () => {
      const dto: UpdateSlideDto = { title: 'T2' };
      const mockResult = { id: '1', title: 'T2' } as any;

      service.update.mockResolvedValueOnce(mockResult);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('deve repassar ID para remove', async () => {
      const mockResult = { id: '1', title: 'T1' } as any;

      service.remove.mockResolvedValueOnce(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
