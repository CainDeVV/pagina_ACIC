import { Test, TestingModule } from '@nestjs/testing';
import { AssociadosService } from './associados.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('AssociadosService', () => {
  let service: AssociadosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssociadosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AssociadosService>(AssociadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
