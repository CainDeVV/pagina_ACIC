import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'O email deve ser um endereço válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'O código OTP é obrigatório.' })
  @Length(6, 6, { message: 'O código deve ter 6 dígitos.' })
  code!: string;
}
