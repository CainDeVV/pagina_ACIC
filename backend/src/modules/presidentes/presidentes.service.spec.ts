import { Test, TestingModule } from '@nestjs/testing';
import { PresidentesService } from './presidentes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('PresidentesService', () => {
  let service: PresidentesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresidentesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PresidentesService>(PresidentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
