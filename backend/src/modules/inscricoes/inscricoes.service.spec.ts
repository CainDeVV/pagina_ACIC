import { Test, TestingModule } from '@nestjs/testing';
import { InscricoesService } from './inscricoes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('InscricoesService', () => {
  let service: InscricoesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscricoesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<InscricoesService>(InscricoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
