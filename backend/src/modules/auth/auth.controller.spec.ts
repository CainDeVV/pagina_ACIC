import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    authService = mockDeep<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Bypassa o Guard no teste unitário
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('deve repassar o DTO para o AuthService e retornar o token', async () => {
      const loginDto = { email: 'admin@acic.com', password: '123' };
      const expectedResult = {
        access_token: 'fake_access',
        refresh_token: 'fake_refresh',
        user: {
          id: '1',
          email: 'admin@acic.com',
          name: 'Admin',
          role: 'ADMIN' as const,
        },
      };

      authService.login.mockResolvedValueOnce(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh', () => {
    it('deve repassar o DTO para o AuthService e retornar os novos tokens', async () => {
      const refreshDto = { refreshToken: 'old-refresh' };
      const expectedResult = {
        access_token: 'new_access',
        refresh_token: 'new_refresh',
        user: {
          id: '1',
          email: 'admin@acic.com',
          name: 'Admin',
          role: 'ADMIN' as const,
        },
      };

      authService.refresh.mockResolvedValueOnce(expectedResult);

      const result = await controller.refresh(refreshDto);

      expect(authService.refresh).toHaveBeenCalledWith(refreshDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('deve repassar o DTO para o AuthService encerra a sessão', async () => {
      const refreshDto = { refreshToken: 'some-refresh' };

      authService.logout.mockResolvedValueOnce(undefined);

      const result = await controller.logout(refreshDto);

      expect(authService.logout).toHaveBeenCalledWith(refreshDto);
      expect(result).toBeUndefined();
    });
  });
});
