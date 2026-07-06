import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSlideDto {
  @ApiProperty({ example: 'Fortalecendo o comércio de Crateús' })
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Há décadas unindo empresários e impulsionando a economia regional', required: false })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({ example: 'https://acic.com.br/contatos', required: false })
  @IsUrl({ require_tld: false })
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ enum: PublishStatus, default: PublishStatus.PUBLISHED, required: false })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}