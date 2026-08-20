import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ description: 'Código OTP para verificação de segurança (necessário ao alterar senha)', required: false })
  @IsOptional()
  @IsString()
  otpCode?: string;
}
