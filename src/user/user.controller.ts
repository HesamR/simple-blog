import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { JWTGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserPayload } from './interface/user-payload.interface';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(JWTGuard)
  async profile(@CurrentUser() { id }: UserPayload) {
    const user = await this.userService.findById(id, { profile: true });

    return {
      name: user.profile.name,
      bio: user.profile.bio,
    };
  }

  @Get('profile/:id')
  async profileById(@Param('id') id: number) {
    const user = await this.userService.findById(id, { profile: true });

    return {
      name: user.profile.name,
      bio: user.profile.bio,
    };
  }

  @Post('edit')
  @UseGuards(JWTGuard)
  async edit(
    @CurrentUser() user: UserPayload,
    @Body() editUserDto: EditUserDto,
  ) {
    const profile = await this.userService.editProfile(user.id, editUserDto);
    return { name: profile.name, bio: profile.bio };
  }
}
