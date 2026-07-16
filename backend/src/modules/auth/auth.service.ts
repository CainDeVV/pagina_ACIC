import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { User, Session } from '@prisma/client';

const MAX_SESSIONS = 5;
const REFRESH_TOKEN_EXPIRATION_DAYS = 7;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    this.logger.log(`Tentativa de login para o email: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        sessions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException(
        'Credenciais inválidas ou usuário inativo.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Credenciais inválidas ou usuário inativo.',
      );
    }

    // Gerenciar limite de sessões (DoS Mitigation)
    if (user.sessions.length >= MAX_SESSIONS) {
      const excessSessions = user.sessions.length - MAX_SESSIONS + 1;
      const sessionsToDelete = user.sessions
        .slice(0, excessSessions)
        .map((s) => s.id);

      await this.prisma.session.deleteMany({
        where: { id: { in: sessionsToDelete } },
      });
      this.logger.log(
        `Removidas ${excessSessions} sessões antigas para o usuário ${user.id}.`,
      );
    }

    return this.generateTokensAndSession(user);
  }

  async refresh(refreshDto: RefreshDto) {
    const rawToken = refreshDto.refreshToken;
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    let session: Session;
    try {
      // Exclusão atômica (O erro P2025 mitiga a Race Condition de múltiplas abas no SPA)
      session = await this.prisma.session.delete({
        where: { tokenHash },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        this.logger.warn(
          `Race condition detectada ou token já utilizado no refresh. Hash: ${tokenHash}`,
        );
        throw new UnauthorizedException('Sessão inválida ou expirada.');
      }
      throw error;
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Usuário inativo ou não encontrado.');
    }

    return this.generateTokensAndSession(user);
  }

  async logout(refreshDto: RefreshDto) {
    const rawToken = refreshDto.refreshToken;
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    try {
      // Apenas destroi se achar o token
      const session = await this.prisma.session.delete({
        where: { tokenHash },
      });
      this.logger.log(
        `Sessão encerrada com sucesso para o usuário ${session.userId}.`,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        this.logger.warn(
          `Sessão já destruída ou inexistente no logout. Hash: ${tokenHash}`,
        );
      } else {
        throw error;
      }
    }
  }

  private async generateTokensAndSession(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Gerar Opaque Token fixo para a sessão
    const refresh_token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(refresh_token)
      .digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
