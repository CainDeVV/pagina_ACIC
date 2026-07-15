import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('NoticiasService', () => {
  let service: NoticiasService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticiasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NoticiasService>(NoticiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
