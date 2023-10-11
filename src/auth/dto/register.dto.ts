import { IsEmail, IsStrongPassword, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsOptional()
  name: string;

  @IsOptional()
  bio: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsStrongPassword()
  password: string;
}
