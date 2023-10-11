import { IsJWT, IsStrongPassword } from 'class-validator';

export class ForgetPasswordValidateDto {
  @IsJWT()
  token: string;

  @IsStrongPassword()
  newPassword: string;
}
