import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { RegistrationStatus } from '@prisma/client';

export class CreateInscricaoDto {
  @ApiProperty({ description: 'ID do Evento' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  eventoId: string;

  @ApiProperty({ description: 'ID do Associado' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
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
