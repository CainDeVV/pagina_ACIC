import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiretoriaDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @ApiProperty({ example: 'Presidente' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'O cargo é obrigatório.' })
  role!: string;

  @ApiProperty({
    example: 'PRESIDENTE',
    description: 'Categoria usada para agrupar na tela',
  })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  category!: string;

  @ApiProperty({
    example: 'https://imagens.acic.com/diretor.jpg',
    required: false,
  })
  @IsUrl(
    { require_tld: false },
    { message: 'A imagem deve ser uma URL válida.' },
  )
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: 'Biografia do diretor...', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
