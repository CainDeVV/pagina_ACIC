import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCertificadoSolicitacaoDto } from './create-certificado.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCertificadoSolicitacaoDto extends PartialType(CreateCertificadoSolicitacaoDto) {
  @ApiProperty({ description: 'URL ou caminho do arquivo do certificado', required: false })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
