import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePresidenteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  termStart: number;

  @IsInt()
  @IsOptional()
  termEnd?: number;

  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
