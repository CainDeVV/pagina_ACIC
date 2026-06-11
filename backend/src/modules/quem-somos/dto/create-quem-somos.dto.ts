import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateQuemSomosDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  content: any;

  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
