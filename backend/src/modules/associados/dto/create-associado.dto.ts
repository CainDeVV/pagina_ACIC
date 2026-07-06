import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAssociadoDto {
  @ApiProperty({
    description: 'ID do usuário associado (User com role ASSOCIADO)',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Razão social da empresa' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Nome fantasia', required: false })
  @IsString()
  @IsOptional()
  tradeName?: string;

  @ApiProperty({ description: 'CNPJ da empresa' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Endereço da empresa', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Se a associação está ativa',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
