import { Test, TestingModule } from '@nestjs/testing';
import { AssociadosService } from './associados.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateAssociadoDto } from './dto/create-associado.dto';

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

  describe('create', () => {
    const dto: CreateAssociadoDto = {
      userId: 'user1',
      companyName: 'ACIC Corp',
      cnpj: '00.000.000/0001-00',
      address: 'Rua X',
      phone: '11999999999',
    };

    it('deve estourar NotFoundException se o usuário não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('deve estourar ConflictException se o CNPJ já estiver em uso', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1' } as any);
      prisma.associado.findUnique.mockResolvedValue({ id: '1' } as any); // CNPJ em uso

      await expect(service.create(dto)).rejects.toThrow(
        'Já existe um associado com este CNPJ',
      );
    });

    it('deve estourar ConflictException se o usuário já tiver uma empresa', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1' } as any);
      prisma.associado.findUnique
        .mockResolvedValueOnce(null) // CNPJ livre
        .mockResolvedValueOnce({ id: '1' } as any); // User já associado

      await expect(service.create(dto)).rejects.toThrow(
        'Este usuário já possui uma empresa associada',
      );
    });

    it('deve criar se tudo estiver correto', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1' } as any);
      prisma.associado.findUnique.mockResolvedValue(null); // Livre

      prisma.associado.create.mockResolvedValue({ id: 'new' } as any);

      await service.create(dto);
      expect(prisma.associado.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('deve retornar associados com dados do usuário', async () => {
      prisma.associado.findMany.mockResolvedValue([{ id: '1' } as any]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(prisma.associado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { user: { select: { name: true, email: true } } },
        }),
      );
    });
  });
});
