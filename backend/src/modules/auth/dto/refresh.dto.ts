import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token ativo para renovar a sessão',
    example: 'd28a38...fa1849',
  })
  @IsString({ message: 'O refreshToken deve ser um texto válido' })
  @IsNotEmpty({ message: 'O refreshToken é obrigatório' })
  refreshToken: string;
}
