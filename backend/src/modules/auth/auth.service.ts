import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { User, Session } from '@prisma/client';

const MAX_SESSIONS = 5;
const REFRESH_TOKEN_EXPIRATION_DAYS = 7;
const OTP_EXPIRATION_MINUTES = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // ─── ETAPA 1: Valida credenciais e envia OTP por email ───────────────────────
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    this.logger.log(`Tentativa de login (1º fator) para: ${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo.');
    }

    // Gera código OTP de 6 dígitos
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Salva o OTP (hashed para segurança extra) no banco
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otpHash, otpExpiresAt },
    });

    // Envia o código por email
    try {
      await this.emailService.sendOtpEmail(user.name, user.email, otpCode);
      this.logger.log(`OTP gerado e enviado para ${email}. Expira em ${OTP_EXPIRATION_MINUTES} min.`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${email}: ${error.message}`);
      if (process.env.NODE_ENV !== 'development') {
        throw new Error('Falha ao enviar o código de verificação. Tente novamente mais tarde.');
      }
      this.logger.warn(`[MODO DEV] Ignorando erro de SMTP para permitir testes locais.`);
    }

    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[MODO DEV] O código OTP para ${email} é: ${otpCode}`);
    }

    return {
      message: 'Código de verificação enviado para o seu email. Verifique sua caixa de entrada.',
      requiresOtp: true,
      email: user.email,
    };
  }

  // ─── ETAPA 2: Valida o OTP e emite os tokens de sessão ───────────────────────
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;
    this.logger.log(`Verificação de OTP (2º fator) para: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        sessions: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!user || !user.active || !user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('Código inválido ou expirado. Tente fazer login novamente.');
    }

    // Verifica expiração
    if (user.otpExpiresAt < new Date()) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpCode: null, otpExpiresAt: null },
      });
      throw new UnauthorizedException('O código expirou. Faça o login novamente.');
    }

    // Verifica o código (comparação com hash)
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (codeHash !== user.otpCode) {
      throw new BadRequestException('Código incorreto.');
    }

    // Limpa o OTP do banco (uso único)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiresAt: null },
    });

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
      session = await this.prisma.session.delete({ where: { tokenHash } });
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

  async generateAndSendOtpForAction(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.active) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo.');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otpHash, otpExpiresAt },
    });

    try {
      await this.emailService.sendOtpEmail(user.name, user.email, otpCode);
      this.logger.log(`Action OTP gerado e enviado para ${user.email}. Expira em ${OTP_EXPIRATION_MINUTES} min.`);
    } catch (error) {
      this.logger.error(`Erro ao enviar Action OTP para ${user.email}: ${error.message}`);
      if (process.env.NODE_ENV !== 'development') {
        throw new Error('Falha ao enviar o código de verificação. Tente novamente mais tarde.');
      }
      this.logger.warn(`[MODO DEV] Ignorando erro de SMTP para permitir testes locais.`);
    }

    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[MODO DEV] O código ACTION OTP para ${user.email} é: ${otpCode}`);
    }

    return { message: 'Código de verificação enviado.' };
  }

  async logout(refreshDto: RefreshDto) {
    const rawToken = refreshDto.refreshToken;
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    try {
      const session = await this.prisma.session.delete({ where: { tokenHash } });
      this.logger.log(`Sessão encerrada com sucesso para o usuário ${session.userId}.`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        this.logger.warn(`Sessão já destruída ou inexistente no logout. Hash: ${tokenHash}`);
      } else {
        throw error;
      }
    }
  }

  private async generateTokensAndSession(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    const refresh_token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(refresh_token)
      .digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    await this.prisma.session.create({
      data: { userId: user.id, tokenHash, expiresAt },
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
