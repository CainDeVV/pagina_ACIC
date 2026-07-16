import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nome da categoria', example: 'Saúde' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cor em formato HEX',
    example: '#3B82F6',
    required: false,
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'color must be a valid HEX color code',
  })
  @IsOptional()
  color?: string;

  @ApiProperty({ description: 'Status de visibilidade', default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
