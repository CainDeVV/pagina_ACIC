import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { CertificateStatus } from '@prisma/client';

export class CreateCertificadoSolicitacaoDto {
  @ApiProperty({ description: 'ID do Associado solicitante' })
  @IsString()
  @IsNotEmpty()
  associadoId: string;

  @ApiProperty({
    description: 'ID do Evento relacionado (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  eventoId?: string;

  @ApiProperty({
    description: 'Motivo ou observação da solicitação',
    required: false,
  })
  @IsString()
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
