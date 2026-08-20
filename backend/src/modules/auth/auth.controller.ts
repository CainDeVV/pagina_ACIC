import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requisições por minuto
  @ApiOperation({ summary: 'Realizar login (Etapa 1 — valida credenciais e envia OTP por email)' })
  @ApiResponse({ status: 200, description: 'OTP enviado para o email do usuário.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 tentativas de OTP por minuto
  @ApiOperation({ summary: 'Verificar OTP (Etapa 2 — valida código e retorna tokens)' })
  @ApiResponse({ status: 200, description: 'Login completo. Tokens emitidos.' })
  @ApiResponse({ status: 400, description: 'Código OTP incorreto.' })
  @ApiResponse({ status: 401, description: 'Código expirado ou inválido.' })
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Renovar tokens de acesso (Opaque Session)' })
  @ApiResponse({ status: 200, description: 'Tokens renovados.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado.' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Encerrar sessão ativa' })
  @ApiResponse({ status: 200, description: 'Sessão encerrada com sucesso.' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() refreshDto: RefreshDto) {
    return this.authService.logout(refreshDto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Proteção contra SPAM
  @ApiOperation({ summary: 'Solicitar OTP para ações sensíveis (Step-up)' })
  @ApiResponse({ status: 200, description: 'OTP enviado para o e-mail do usuário logado.' })
  @Post('request-action-otp')
  @HttpCode(HttpStatus.OK)
  requestActionOtp(@CurrentUser() user: any) {
    return this.authService.generateAndSendOtpForAction(user.sub);
  }
}
