import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CertificateStatus } from '@prisma/client';

export class CreateCertificadoSolicitacaoDto {
  @ApiProperty({ description: 'ID do Associado solicitante' })
  @IsString()
  @Transform(({ value }): any =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  associadoId: string;

  @ApiProperty({
    description: 'ID do Evento relacionado (opcional)',
    required: false,
  })
  @IsString()
  @Transform(({ value }): any =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  eventoId?: string;

  @ApiProperty({
    description: 'Motivo ou observação da solicitação',
    required: false,
  })
  @IsString()
  @Transform(({ value }): any =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Status inicial (default: PENDING)',
    enum: CertificateStatus,
    required: false,
  })
  @IsEnum(CertificateStatus)
  @IsOptional()
  status?: CertificateStatus;
}
