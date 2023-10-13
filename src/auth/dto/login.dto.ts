import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
