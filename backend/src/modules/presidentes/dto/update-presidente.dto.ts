import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePresidenteDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  termStart?: number;

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
