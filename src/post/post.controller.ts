import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: any,
  ) {
    const userId = request.user.userId;

    return this.postService.uploadPhoto(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Request() request: any) {
    return this.postService.list(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  listUserPost(@Param('username') username: string) {
    return this.postService.listUserPost(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/timeline')
  timeline(@Request() request: any) {
    return this.postService.getTimeline(request.user.userId);
  }
}
