import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Article } from '@prisma/client';
import { ArticleService } from './article.service';
import { JWTGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserPayload } from 'src/user/interface/user-payload.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('all')
  async all(): Promise<Article[]> {
    return this.articleService.getAll();
  }

  @Get('user/:id')
  async byUserId(@Param('id') userId: number): Promise<Article[]> {
    return this.articleService.getByUserId(userId);
  }

  @Get(':id')
  async byId(@Param('id') id: number): Promise<Article> {
    return this.articleService.getById(id);
  }

  @Post('create')
  @UseGuards(JWTGuard)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(user.id, createArticleDto);
  }

  @Post('edit')
  @UseGuards(JWTGuard)
  async edit(
    @CurrentUser() user: UserPayload,
    @Body() editArticleDto: EditArticleDto,
  ) {
    return this.articleService.edit(user.id, editArticleDto);
  }
}