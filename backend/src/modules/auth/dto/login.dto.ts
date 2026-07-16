import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail({}, { message: 'O email deve ser um endereço válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password!: string;
}
