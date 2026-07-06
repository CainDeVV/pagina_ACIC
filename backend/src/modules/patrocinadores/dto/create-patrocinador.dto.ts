import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PublishStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatrocinadorDto {
  @ApiProperty({ description: 'Nome do patrocinador' })
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL da logomarca' })
  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @ApiPropertyOptional({ description: 'Link para o site do patrocinador' })
  @IsString()
  @IsOptional()
  linkUrl?: string;

  @ApiPropertyOptional({ enum: PublishStatus, default: PublishStatus.PUBLISHED })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
