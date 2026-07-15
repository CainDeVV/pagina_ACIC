import { Test, TestingModule } from '@nestjs/testing';
import { QuemSomosService } from './quem-somos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('QuemSomosService', () => {
  let service: QuemSomosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuemSomosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<QuemSomosService>(QuemSomosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
