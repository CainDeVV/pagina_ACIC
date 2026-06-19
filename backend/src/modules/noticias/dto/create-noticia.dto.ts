import { PublishStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticiaDto {
  @ApiProperty({ example: 'ACIC realiza evento de networking para associados' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @ApiProperty({
    example: 'Evento reuniu mais de 100 empresários da região.',
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    example: { blocks: [] },
    description: 'JSON estruturado do Editor.js',
  })
  @IsObject({ message: 'O conteúdo deve ser um objeto JSON válido do Editor.js.' })
  @IsNotEmpty({ message: 'O conteúdo da notícia é obrigatório.' })
  content: any;

  @ApiProperty({
    example: 'https://imagens.acic.com/noticia.jpg',
    required: false,
  })
  @IsUrl({}, { message: 'A imagem de capa deve ser uma URL válida.' })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    example: true,
    description: 'Define se a notícia será exibida em destaque na Home',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  destaque?: boolean;

  @ApiProperty({
    enum: PublishStatus,
    default: PublishStatus.DRAFT,
    required: false,
  })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @ApiProperty({
    example: '2026-06-19T14:00:00Z',
    description: 'Data de publicação (ISO 8601)',
    required: false,
  })
  @IsDateString({}, { message: 'A data de publicação deve estar no formato ISO 8601 válido.' })
  @IsOptional()
  publishedAt?: string;
}
