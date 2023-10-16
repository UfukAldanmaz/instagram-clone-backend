import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUserProfile(@Param('id') userId: string) {
    const user = await this.usersService.getUserProfile(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
