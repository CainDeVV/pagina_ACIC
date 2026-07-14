import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail({}, { message: 'O email deve ser um endereço válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password!: string;
}
