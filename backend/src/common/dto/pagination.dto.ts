import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
  IsString,
  IsArray,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type((): any => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type((): any => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Termo de busca genérica' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtro por IDs de categorias' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }): any => {
    if (value === undefined) return undefined;
    const array = Array.isArray(value) ? value : [value];
    const filtered = array.filter((v) => v !== undefined && v !== '');
    return filtered.length > 0 ? filtered : undefined;
  })
  categoriasIds?: string[];

  @ApiPropertyOptional({
    description: 'Retornar apenas próximos itens (futuros)',
  })
  @IsOptional()
  @Transform(({ value }): any => value === 'true' || value === true)
  upcomingOnly?: boolean;
}
