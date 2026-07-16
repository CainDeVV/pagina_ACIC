import { Test, TestingModule } from '@nestjs/testing';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('HomeController', () => {
  let controller: HomeController;
  let service: DeepMockProxy<HomeService>;

  beforeEach(async () => {
    service = mockDeep<HomeService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [{ provide: HomeService, useValue: service }],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: (context: any, next: any) => next.handle() })
      .compile();

    controller = module.get<HomeController>(HomeController);
  });

  describe('getDestaques', () => {
    it('deve chamar getDestaques do HomeService e retornar o payload BFF', async () => {
      const mockResult = {
        data: {
          slides: [],
          servicos: [],
          diretoria: [],
          eventos: [],
          noticias: [],
        },
      } as any;
      service.getDestaques.mockResolvedValueOnce(mockResult);

      const result = await controller.getDestaques();

      expect(service.getDestaques).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
