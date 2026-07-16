import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAssociadoDto {
  @ApiProperty({
    description: 'ID do usuário associado (User com role ASSOCIADO)',
  })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Razão social da empresa' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Nome fantasia', required: false })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  tradeName?: string;

  @ApiProperty({ description: 'CNPJ da empresa' })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Endereço da empresa', required: false })
  @IsString()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
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
