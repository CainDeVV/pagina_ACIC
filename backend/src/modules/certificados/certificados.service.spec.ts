import { Test, TestingModule } from '@nestjs/testing';
import { CertificadosService } from './certificados.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateCertificadoSolicitacaoDto } from './dto/create-certificado.dto';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { UserRole } from '@prisma/client';

describe('CertificadosService', () => {
  let service: CertificadosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificadosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CertificadosService>(CertificadosService);
  });

  describe('create', () => {
    const dto: CreateCertificadoSolicitacaoDto = {
      associadoId: 'assoc1',
      eventoId: 'evento1',
      reason: 'Necessidade',
    };

    const adminUser: JwtPayload = {
      id: 'admin1',
      email: 'a@a.com',
      role: UserRole.ADMIN,
    };
    const assocUser: JwtPayload = {
      id: 'user1',
      email: 'u@u.com',
      role: UserRole.ASSOCIADO,
    };

    it('deve estourar ForbiddenException se associado solicitar para outra empresa', async () => {
      prisma.associado.findUnique.mockResolvedValueOnce({
        id: 'assoc-diferente',
        userId: 'user1',
      } as any);
      await expect(service.create(dto, assocUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve estourar NotFoundException se eventoId for enviado e o evento não existir', async () => {
      prisma.associado.findUnique.mockResolvedValue({ id: 'assoc1' } as any); // Associado existe
      prisma.evento.findUnique.mockResolvedValue(null); // Evento não existe

      await expect(service.create(dto, adminUser)).rejects.toThrow(
        'Evento não encontrado',
      );
    });

    it('deve criar solicitação validando associado e evento', async () => {
      prisma.associado.findUnique.mockResolvedValue({ id: 'assoc1' } as any);
      prisma.evento.findUnique.mockResolvedValue({ id: 'evento1' } as any);

      prisma.certificadoSolicitacao.create.mockResolvedValue({
        id: 'cert1',
      } as any);

      await service.create(dto, adminUser);
      expect(prisma.certificadoSolicitacao.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('update', () => {
    it('deve injetar reviewedAt dinamicamente se o status mudar de PENDING', async () => {
      prisma.certificadoSolicitacao.findUnique.mockResolvedValue({
        id: '1',
      } as any);
      prisma.certificadoSolicitacao.update.mockResolvedValue({} as any);

      await service.update('1', { status: 'APPROVED' });

      const updateCall = prisma.certificadoSolicitacao.update.mock.calls[0][0];
      expect(updateCall.data.reviewedAt).toBeInstanceOf(Date);
      expect(updateCall.data.status).toBe('APPROVED');
    });

    it('não deve injetar reviewedAt se status continuar PENDING ou indefinido', async () => {
      prisma.certificadoSolicitacao.findUnique.mockResolvedValue({
        id: '1',
      } as any);
      prisma.certificadoSolicitacao.update.mockResolvedValue({} as any);

      await service.update('1', { reason: 'Novo Motivo' });

      const updateCall = prisma.certificadoSolicitacao.update.mock.calls[0][0];
      expect(updateCall.data.reviewedAt).toBeUndefined();
    });
  });
});
