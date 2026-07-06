import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { RegistrationStatus } from '@prisma/client';

export class CreateInscricaoDto {
  @ApiProperty({ description: 'ID do Evento' })
  @IsString()
  @IsNotEmpty()
  eventoId: string;

  @ApiProperty({ description: 'ID do Associado' })
  @IsString()
  @IsNotEmpty()
  associadoId: string;

  @ApiProperty({
    description: 'Status da inscrição',
    enum: RegistrationStatus,
    required: false,
  })
  @IsEnum(RegistrationStatus)
  @IsOptional()
  status?: RegistrationStatus;
}
