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

  async deleteById(id: number, userId: number): Promise<Article | null> {
    return this.prismaService.article.delete({ where: { id, userId } });
  }

  async getAll() {
    return this.prismaService.article.findMany({
      select: {
        id: true,
        title: true,
        summery: true,
        createAt: true,
        updateAt: true,
        user: { select: { profile: { select: { name: true, id: true } } } },
      },
    });
  }

  async getById(id: number) {
    return this.prismaService.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        summery: true,
        content: true,
        createAt: true,
        updateAt: true,
        user: { select: { profile: { select: { name: true, id: true } } } },
      },
    });
  }

  async getByUserId(userId: number) {
    return this.prismaService.article.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        summery: true,
        createAt: true,
        updateAt: true,
      },
    });
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
