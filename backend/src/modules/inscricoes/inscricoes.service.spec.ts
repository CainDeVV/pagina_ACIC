import { Test, TestingModule } from '@nestjs/testing';
import { InscricoesService } from './inscricoes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { UserRole } from '@prisma/client';

describe('InscricoesService', () => {
  let service: InscricoesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscricoesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<InscricoesService>(InscricoesService);
  });

  describe('create', () => {
    const dto: CreateInscricaoDto = {
      eventoId: 'evento1',
      associadoId: 'assoc1',
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

    it('deve estourar ForbiddenException se associado tentar inscrever outra empresa', async () => {
      prisma.associado.findUnique.mockResolvedValueOnce({
        id: 'assoc-diferente',
        userId: 'user1',
      } as any);
      await expect(service.create(dto, assocUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve estourar NotFoundException se evento não existir', async () => {
      prisma.evento.findUnique.mockResolvedValue(null);
      await expect(service.create(dto, adminUser)).rejects.toThrow(
        'Evento não encontrado',
      );
    });

    it('deve estourar NotFoundException se associado não existir (Admin bypasses role check)', async () => {
      prisma.evento.findUnique.mockResolvedValue({ id: 'evento1' } as any);
      prisma.associado.findUnique.mockResolvedValue(null);
      await expect(service.create(dto, adminUser)).rejects.toThrow(
        'Associado não encontrado',
      );
    });

    it('deve estourar ConflictException se já estiver inscrito', async () => {
      prisma.evento.findUnique.mockResolvedValue({ id: 'evento1' } as any);
      prisma.associado.findUnique.mockResolvedValue({ id: 'assoc1' } as any);
      prisma.inscricaoEvento.findUnique.mockResolvedValue({
        id: 'inscricao1',
      } as any);

      await expect(service.create(dto, adminUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar inscrição se tudo for válido', async () => {
      prisma.evento.findUnique.mockResolvedValue({ id: 'evento1' } as any);
      prisma.associado.findUnique.mockResolvedValue({ id: 'assoc1' } as any);
      prisma.inscricaoEvento.findUnique.mockResolvedValue(null);

      prisma.inscricaoEvento.create.mockResolvedValue({
        id: 'nova-inscricao',
      } as any);

      await service.create(dto, adminUser);
      expect(prisma.inscricaoEvento.create).toHaveBeenCalledWith({ data: dto });
    });
  });
});
