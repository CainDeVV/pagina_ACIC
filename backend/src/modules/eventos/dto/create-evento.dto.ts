import { EventStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventoDto {
  @ApiProperty({ example: '150 Anos da ACIC Crateús' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title!: string;

  @ApiProperty({ example: { blocks: [] }, description: 'JSON estruturado do Editor.js' })
  @IsObject({ message: 'A descrição deve ser um objeto JSON válido.' })
  @IsNotEmpty({ message: 'A descrição do evento é obrigatória.' })
  description: any;

  @ApiProperty({ example: 'Sede da ACIC - Crateús, CE', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '2026-06-15T19:00:00Z', description: 'Data e hora de início (ISO 8601)' })
  @IsDateString({}, { message: 'A data de início deve estar no formato ISO 8601 válido.' })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  startsAt!: string;

  @ApiProperty({ example: '2026-06-15T22:00:00Z', required: false })
  @IsDateString({}, { message: 'A data de término deve estar no formato ISO 8601 válido.' })
  @IsOptional()
  endsAt?: string;

  @ApiProperty({ example: 200, required: false })
  @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
  @IsOptional()
  capacity?: number;

  @ApiProperty({ example: 'https://imagens.acic.com/evento.jpg', required: false })
  @IsUrl({}, { message: 'A imagem de capa deve ser uma URL válida.' })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ enum: EventStatus, default: EventStatus.DRAFT, required: false })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}