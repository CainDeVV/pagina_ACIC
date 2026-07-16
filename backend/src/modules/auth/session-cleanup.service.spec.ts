import { Test, TestingModule } from '@nestjs/testing';
import { SessionCleanupService } from './session-cleanup.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Logger } from '@nestjs/common';

describe('SessionCleanupService', () => {
  let service: SessionCleanupService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionCleanupService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SessionCleanupService>(SessionCleanupService);
  });

  describe('handleCron', () => {
    it('deve chamar prisma.session.deleteMany passando a data atual (expect.any(Date))', async () => {
      prisma.session.deleteMany.mockResolvedValueOnce({ count: 5 });

      await service.handleCron();

      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('deve logar o erro e não quebrar a aplicação caso o Prisma falhe (Fire and Forget)', async () => {
      // Cria um spy silencioso no logger do serviço
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => {});

      const fakeError = new Error('Database Timeout');
      prisma.session.deleteMany.mockRejectedValueOnce(fakeError);

      // Não usamos expects(service.handleCron()).rejects.toThrow() porque a função deve engolir a falha
      await expect(service.handleCron()).resolves.not.toThrow();

      // Garantimos que o erro foi pego e logado
      expect(loggerSpy).toHaveBeenCalledWith(
        'Erro ao expurgar sessões:',
        fakeError,
      );

      loggerSpy.mockRestore();
    });
  });
});
