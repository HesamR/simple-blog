import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Article } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async create(
    userId: number,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.prismaService.article.create({
      data: {
        userId,
        title: createArticleDto.title,
        summery: createArticleDto.summery,
        content: createArticleDto.content,
      },
    });
  }

  async edit(
    userId: number,
    editArticleDto: EditArticleDto,
  ): Promise<Article | null> {
    return this.prismaService.article.update({
      where: { id: editArticleDto.articleId, userId },
      data: {
        title: editArticleDto.title,
        summery: editArticleDto.summery,
        content: editArticleDto.content,
      },
    });
  }

  async getAll(): Promise<Article[]> {
    return this.prismaService.article.findMany();
  }

  async getById(id: number): Promise<Article> {
    return this.prismaService.article.findUnique({ where: { id } });
  }

  async getByUserId(userId: number): Promise<Article[]> {
    return this.prismaService.article.findMany({ where: { userId } });
  }

  async getByUserIdAndId(userId: number, id: number): Promise<Article> {
    try {
      const article = await this.prismaService.article.findUniqueOrThrow({
        where: { userId, id },
      });

      return article;
    } catch {
      throw new UnauthorizedException(
        'user does not have any article by that id',
      );
    }
  }
}
