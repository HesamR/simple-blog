import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Session,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserPayload } from './interface/user-payload.interface';
import { EditUserDto } from './dto/edit-user.dto';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { SessionPayload } from 'src/auth/interface/session-payload.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('current')
  @UseGuards(SessionGuard)
  async profile(
    @CurrentUser() { id }: UserPayload,
    @Session() session: SessionPayload,
  ) {
    const user = await this.userService.findById(id, { profile: true });

    return {
      id,
      email: user.email,
      name: user.profile.name,
      bio: user.profile.bio,
      expiresAt: session.expiresAt.getTime(),
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
  @UseGuards(SessionGuard)
  async edit(
    @CurrentUser() user: UserPayload,
    @Body() editUserDto: EditUserDto,
  ) {
    const profile = await this.userService.editProfile(user.id, editUserDto);
    return { name: profile.name, bio: profile.bio };
  }
}
