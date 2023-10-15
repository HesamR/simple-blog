import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class EditArticleDto {
  @IsNumber()
  articleId: number;

  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  summery?: string;

  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
