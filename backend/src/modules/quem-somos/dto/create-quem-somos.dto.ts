import { PublishStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEditorJs } from '../../../common/validators/is-editorjs.validator';
import { EditorJsContent } from '../../../common/types/editor-js.type';

export class CreateQuemSomosDto {
  @ApiProperty({
    example: 'estatuto',
    description:
      'Chave única de identificação da página (ex: estatuto, cmec, quem-somos)',
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  key!: string;

  @ApiProperty({ example: 'Estatuto da ACIC' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: { blocks: [] },
    description: 'JSON estruturado do Editor.js',
  })
  @IsEditorJs()
  @IsNotEmpty()
  content: EditorJsContent;

  @ApiProperty({
    enum: PublishStatus,
    default: PublishStatus.PUBLISHED,
    required: false,
  })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
