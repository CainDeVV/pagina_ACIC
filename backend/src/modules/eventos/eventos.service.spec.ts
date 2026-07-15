import { Test, TestingModule } from '@nestjs/testing';
import { EventosService } from './eventos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('EventosService', () => {
  let service: EventosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<EventosService>(EventosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
