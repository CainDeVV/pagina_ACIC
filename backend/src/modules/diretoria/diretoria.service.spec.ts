import { Test, TestingModule } from '@nestjs/testing';
import { DiretoriaService } from './diretoria.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('DiretoriaService', () => {
  let service: DiretoriaService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiretoriaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DiretoriaService>(DiretoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
