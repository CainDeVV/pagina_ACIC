import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

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
