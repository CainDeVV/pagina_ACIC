import { PublishStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuemSomosDto {
  @ApiProperty({ example: 'estatuto', description: 'Chave única de identificação da página (ex: estatuto, cmec, quem-somos)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Estatuto da ACIC' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: { blocks: [] }, description: 'JSON estruturado do Editor.js' })
  @IsObject()
  @IsNotEmpty()
  content: any;

  @ApiProperty({ enum: PublishStatus, default: PublishStatus.PUBLISHED, required: false })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}