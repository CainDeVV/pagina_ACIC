import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/interfaces/request-user.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL ERROR: JWT_SECRET não está definido.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: import('@prisma/client').UserRole;
  }): Promise<JwtPayload> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, active: true },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Sessão inválida ou usuário inativo.');
    }

    // O retorno deste método é injetado no Request (ex: req.user)
    // Utilizamos o role atualizado direto do banco para evitar Privilege Escalation de token velho
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
