import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditArticleDto {
  @IsNumber()
  articteId: number;

  @IsNotEmpty()
  title?: string;

  @IsNotEmpty()
  summery?: string;

  @IsNotEmpty()
  content?: string;
}
