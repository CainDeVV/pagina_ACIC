import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSlideDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  linkUrl?: string;

  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
