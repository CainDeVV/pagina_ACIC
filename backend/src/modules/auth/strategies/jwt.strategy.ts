import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/interfaces/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    role: import('@prisma/client').UserRole;
  }): JwtPayload {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido.');
    }
    // O retorno deste método é injetado no Request (ex: req.user)
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
