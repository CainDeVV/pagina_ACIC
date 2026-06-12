import { PublishStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServicoDto {
  @ApiProperty({ example: 'Certificado Digital' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title!: string;

  @ApiProperty({ example: 'Emita o seu certificado sem sair de casa.', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ example: { blocks: [] }, description: 'JSON estruturado do Editor.js' })
  @IsObject({ message: 'A descrição deve ser um objeto JSON válido do Editor.js.' })
  @IsNotEmpty({ message: 'A descrição em formato de blocos é obrigatória.' })
  description: any;

  @ApiProperty({ example: '💻', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'https://imagens.acic.com/certificado.png', required: false })
  @IsUrl({}, { message: 'A imagem deve ser uma URL válida.' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: true, description: 'Define se o serviço aparecerá no banner principal (Slider)', required: false })
  @IsBoolean()
  @IsOptional()
  destaque?: boolean;

  @ApiProperty({ enum: PublishStatus, default: PublishStatus.DRAFT })
  @IsEnum(PublishStatus)
  @IsOptional()
  status?: PublishStatus;
}