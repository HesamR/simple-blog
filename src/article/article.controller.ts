import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Article } from '@prisma/client';
import { ArticleService } from './article.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserPayload } from 'src/user/interface/user-payload.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { DeleteArticleDto } from './dto/delete-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('all')
  async all() {
    return this.articleService.getAll();
  }

  @Get('current-user')
  @UseGuards(SessionGuard)
  async currentUser(@CurrentUser() user: UserPayload) {
    return this.articleService.getByUserId(user.id);
  }

  @Get('user/:id')
  async byUserId(@Param('id') userId: number) {
    return this.articleService.getByUserId(userId);
  }

  @Get('current-user/:id')
  @UseGuards(SessionGuard)
  async currentUserById(
    @CurrentUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<Article> {
    return this.articleService.getByUserIdAndId(user.id, id);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return this.articleService.getById(id);
  }

  @Post('create')
  @UseGuards(SessionGuard)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(user.id, createArticleDto);
  }

  @Post('edit')
  @UseGuards(SessionGuard)
  async edit(
    @CurrentUser() user: UserPayload,
    @Body() editArticleDto: EditArticleDto,
  ) {
    return this.articleService.edit(user.id, editArticleDto);
  }

  @Post('delete')
  @UseGuards(SessionGuard)
  async deleteById(
    @CurrentUser() user: UserPayload,
    @Body() deleteArticleDto: DeleteArticleDto,
  ) {
    return this.articleService.deleteById(deleteArticleDto.articleId, user.id);
  }
}
