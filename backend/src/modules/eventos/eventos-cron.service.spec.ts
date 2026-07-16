import { Test, TestingModule } from '@nestjs/testing';
import { EventosCronService } from './eventos-cron.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EventStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';

describe('EventosCronService', () => {
  let service: EventosCronService;
  let prisma: DeepMockProxy<PrismaService>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosCronService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EventosCronService>(EventosCronService);
    loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleScheduledEvents', () => {
    it('deve disparar updateMany atualizando de DRAFT para PUBLISHED', async () => {
      prisma.evento.updateMany.mockResolvedValue({ count: 3 });

      await service.handleScheduledEvents();

      expect(prisma.evento.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: EventStatus.DRAFT,
            publishedAt: { lte: expect.any(Date) },
          },
          data: {
            status: EventStatus.PUBLISHED,
          },
        }),
      );
    });

    it('deve logar um erro se o prisma falhar, ao invés de derrubar a API', async () => {
      const dbError = new Error('Database Timeout');
      prisma.evento.updateMany.mockRejectedValue(dbError);

      await expect(service.handleScheduledEvents()).resolves.not.toThrow();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Erro ao executar o cron de agendamento de eventos',
        dbError,
      );
    });
  });
});
