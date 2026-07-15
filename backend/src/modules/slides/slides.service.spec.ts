import { Test, TestingModule } from '@nestjs/testing';
import { SlidesService } from './slides.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('SlidesService', () => {
  let service: SlidesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SlidesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SlidesService>(SlidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
