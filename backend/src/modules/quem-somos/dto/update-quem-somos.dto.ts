import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateQuemSomosDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  content?: any;

  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
