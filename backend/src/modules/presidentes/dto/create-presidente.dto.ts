import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePresidenteDto {
  @ApiProperty({ example: 'Francisco Roberto Lima e Silva' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2017 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  termStart!: number;

  @ApiProperty({ example: 2023, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  termEnd?: number;

  @ApiProperty({
    example: 'https://imagens.acic.com/presidente.jpg',
    required: false,
  })
  @IsUrl({ require_tld: false })
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({
    example: 'Atual presidente, focado na reestruturação e modernização...',
    required: false,
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
