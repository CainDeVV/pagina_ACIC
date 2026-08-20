import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SessionCleanupService } from './session-cleanup.service';
import { EmailModule } from '../email/email.module';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    'FATAL ERROR: JWT_SECRET não está definido no ambiente. Inicialização abortada por segurança.',
  );
}

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    EmailModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '15m' }, // 15 minutos de expiração (uso de refresh token opaco)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionCleanupService],
  exports: [AuthService],
})
export class AuthModule {}
