import { PublishStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEditorJs } from '../../../common/validators/is-editorjs.validator';
import { EditorJsContent } from '../../../common/types/editor-js.type';

export class CreateNoticiaDto {
  @ApiProperty({ example: 'ACIC realiza evento de networking para associados' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @ApiProperty({
    example: 'Evento reuniu mais de 100 empresários da região.',
    required: false,
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  summary?: string;

  @ApiProperty({
    example: { blocks: [] },
    description: 'JSON estruturado do Editor.js',
  })
  @IsEditorJs()
  @IsNotEmpty({ message: 'O conteúdo da notícia é obrigatório.' })
  content: EditorJsContent;

  @ApiProperty({
    example: 'https://imagens.acic.com/noticia.jpg',
    required: false,
  })
  @IsUrl(
    { require_tld: false },
    { message: 'A imagem de capa deve ser uma URL válida.' },
  )
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    example: 'Foto: Marcos Oliveira',
    required: false,
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  coverImageCaption?: string;

  @ApiProperty({
    example: true,
    description:
      'Define se a imagem de capa será exibida na página de detalhes',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showCoverImage?: boolean;

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

  @ApiPropertyOptional({
    description: 'Data de publicação. Se omitido, publicado imediatamente.',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ description: 'IDs das categorias vinculadas' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  categoriasIds?: string[];
}
