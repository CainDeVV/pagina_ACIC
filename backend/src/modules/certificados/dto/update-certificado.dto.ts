import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCertificadoSolicitacaoDto } from './create-certificado.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCertificadoSolicitacaoDto extends PartialType(
  CreateCertificadoSolicitacaoDto,
) {
  @ApiProperty({
    description: 'URL ou caminho do arquivo do certificado',
    required: false,
  })
  @IsString()
  @Transform(({ value }): any =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  fileUrl?: string;
}
