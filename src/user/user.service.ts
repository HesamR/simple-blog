import { Injectable } from '@nestjs/common';
import { User, UserProfile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(registerDto.password, salt);

    return this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password,
        setting: { create: { isEmailVerified: false } },
        profile: {
          create: { name: registerDto.name, bio: registerDto.bio },
        },
      },
    });
  }

  async updatePassword(id: number, rawPassword: string) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(rawPassword, salt);

    await this.prismaService.user.update({
      data: { password },
      where: { id },
    });
  }

  async updateEmail(id: number, email: string) {
    await this.prismaService.user.update({
      where: { id },
      data: { email, setting: { update: { isEmailVerified: false } } },
    });
  }

  async verifyEmail(userId: number) {
    await this.prismaService.userSetting.update({
      where: { userId },
      data: { isEmailVerified: true },
    });
  }

  async findById(
    id: number,
    include?: {
      setting?: boolean;
      profile?: boolean;
      sessions?: boolean;
    },
  ) {
    return this.prismaService.user.findUnique({
      where: { id },
      include,
    });
  }

  async findByEmail(
    email: string,
    include?: {
      setting?: boolean;
      profile?: boolean;
      sessions?: boolean;
    },
  ) {
    return this.prismaService.user.findUnique({
      where: { email },
      include,
    });
  }

  async editProfile(
    userId: number,
    editUserDto: EditUserDto,
  ): Promise<UserProfile> {
    return this.prismaService.userProfile.update({
      where: { userId },
      data: { name: editUserDto.name, bio: editUserDto.bio },
    });
  }
}
