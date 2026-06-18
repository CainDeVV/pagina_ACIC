import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePresidenteDto {
  @ApiProperty({ example: 'Francisco Roberto Lima e Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2017 })
  @IsInt()
  @IsNotEmpty()
  termStart!: number;

  @ApiProperty({ example: 2023, required: false })
  @IsInt()
  @IsOptional()
  termEnd?: number;

  @ApiProperty({ example: 'https://imagens.acic.com/presidente.jpg', required: false })
  @IsUrl({ require_tld: false })
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: 'Atual presidente, focado na reestruturação e modernização...', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}