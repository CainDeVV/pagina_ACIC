import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: DeepMockProxy<PrismaService>;
  let jwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    jwtService = mockDeep<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailService, useValue: { sendOtpEmail: jest.fn() } }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('verifyOtp', () => {
    it('deve remover sessões mais antigas se ultrapassar o limite (MAX_SESSIONS=5)', async () => {
      // Simula um usuário com 5 sessões existentes (já no limite)
      // O novo login será a 6ª sessão, logo a mais antiga deve ser deletada
      const mockSessions = [
        { id: '1', createdAt: new Date('2026-01-01') },
        { id: '2', createdAt: new Date('2026-01-02') },
        { id: '3', createdAt: new Date('2026-01-03') },
        { id: '4', createdAt: new Date('2026-01-04') },
        { id: '5', createdAt: new Date('2026-01-05') },
      ];

      const mockUser = {
        id: 'user-id',
        email: 'test@test.com',
        active: true,
        otpCode: 'hashed-otp',
        otpExpiresAt: new Date(Date.now() + 10000), // Futuro
        role: 'ADMIN',
        sessions: mockSessions,
      } as any;

      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      
      // Mock crypto.createHash para bater com 'hashed-otp'
      const crypto = require('crypto');
      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed-otp')
      } as any);

      jwtService.sign.mockReturnValue('fake-jwt-token');
      prisma.session.create.mockResolvedValueOnce({} as any);

      await service.verifyOtp({ email: 'test@test.com', code: '123456' });

      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['1'] } }, // Remove a mais antiga
      });
      
      jest.restoreAllMocks();
    });
  });

  describe('refresh', () => {
    it('deve rejeitar se o prisma lançar P2025 (Sessão já utilizada - Race Condition Mitigation)', async () => {
      const error = new Error('Not found') as any;
      error.code = 'P2025';

      prisma.session.delete.mockRejectedValueOnce(error);

      await expect(
        service.refresh({ refreshToken: 'some-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('não deve lançar erro se a sessão já estiver sido deletada (P2025 bypass)', async () => {
      const error = new Error('Not found') as any;
      error.code = 'P2025';

      prisma.session.delete.mockRejectedValueOnce(error);

      // Se não lançar, o teste passa (Fire and Forget seguro)
      await expect(
        service.logout({ refreshToken: 'some-token' }),
      ).resolves.not.toThrow();
    });
  });
});
