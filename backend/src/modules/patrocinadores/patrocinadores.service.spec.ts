import { Test, TestingModule } from '@nestjs/testing';
import { PatrocinadoresService } from './patrocinadores.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('PatrocinadoresService', () => {
  let service: PatrocinadoresService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatrocinadoresService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PatrocinadoresService>(PatrocinadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
