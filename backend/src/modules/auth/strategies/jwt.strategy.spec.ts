import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: DeepMockProxy<PrismaService>;

  beforeAll(() => {
    // Injetar variável de ambiente fake para evitar FATAL ERROR no construtor
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    // Limpar variável fake
    delete process.env.JWT_SECRET;
  });

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: PrismaService, useValue: prisma }],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('deve lançar UnauthorizedException se não houver payload ou sub', async () => {
      const emptyPayload = {} as any;
      await expect(strategy.validate(emptyPayload)).rejects.toThrow(
        new UnauthorizedException('Token inválido.'),
      );
    });

    it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        strategy.validate({ sub: '999', email: 'test', role: UserRole.ADMIN }),
      ).rejects.toThrow(
        new UnauthorizedException('Sessão inválida ou usuário inativo.'),
      );
    });

    it('deve lançar UnauthorizedException se o usuário estiver inativo', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '123',
        email: 'test@test.com',
        role: UserRole.ADMIN,
        active: false,
      } as any);

      await expect(
        strategy.validate({ sub: '123', email: 'test', role: UserRole.ADMIN }),
      ).rejects.toThrow(
        new UnauthorizedException('Sessão inválida ou usuário inativo.'),
      );
    });

    it('deve retornar o JwtPayload corretamente se o usuário estiver ativo', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        role: UserRole.ADMIN,
        active: true,
      } as any;

      prisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await strategy.validate({
        sub: '123',
        email: 'test@test.com',
        role: UserRole.EDITOR, // O role no token pode ser antigo
      });

      // O strategy deve retornar o role mais recente consultado do Prisma
      expect(result).toEqual({
        id: '123',
        email: 'test@test.com',
        role: UserRole.ADMIN,
      });
    });
  });
});
