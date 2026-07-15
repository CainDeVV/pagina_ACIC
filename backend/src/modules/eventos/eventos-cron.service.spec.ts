import { Test, TestingModule } from '@nestjs/testing';
import { EventosCronService } from './eventos-cron.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('EventosCronService', () => {
  let service: EventosCronService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosCronService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EventosCronService>(EventosCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
