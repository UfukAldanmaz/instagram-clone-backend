import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from '../post/post.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postService: PostService,
  ) {}

  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    const user = await this.usersService.getUserProfile(username);
    console.log('GETUSER', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: any,
  ) {
    const userId = request.user.userId;

    return this.usersService.uploadAvatar(file, userId);
  }
}
