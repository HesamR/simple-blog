import { IsJWT } from 'class-validator';

export class VerifyEmailDto {
  @IsJWT()
  token: string;
}
