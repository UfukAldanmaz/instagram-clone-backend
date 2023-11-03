import {
  Body,
  Controller,
  Delete,
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
import { TimelineResponse } from 'src/timeline-response.dto';
import { Like } from 'src/auth/entities/like.entity';
import { Comment } from 'src/auth/entities/comment.entity';

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
  @Get('/user/:username')
  listUserPost(@Param('username') username: string) {
    return this.postService.listUserPost(username);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/timeline')
  async timeline(@Request() request: any): Promise<TimelineResponse[]> {
    const userId = request.user.userId;

    const timelineData: TimelineResponse[] =
      await this.postService.getTimeline(userId);

    return timelineData;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like/:photoId')
  async likePhoto(
    @Param('photoId') photoId: number,
    @Request() request: any,
  ): Promise<Like> {
    const userId = request.user.userId;
    return this.postService.likePhoto(userId, photoId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/like/:photoId')
  async unlikePhoto(
    @Param('photoId') photoId: number,
    @Request() request: any,
  ) {
    const userId = request.user.userId;
    return await this.postService.unlikePhoto(userId, photoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/likedBy/:photoId')
  async getLikedByUsers(@Param('photoId') photoId: number): Promise<Like[]> {
    return this.postService.getLikedByUsers(photoId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment/:photoId')
  async addComment(
    @Param('photoId') photoId: number,
    @Request() request: any,
    @Body('comment') comment: string,
  ): Promise<Comment> {
    const userId = request.user.userId;
    return this.postService.addComment(photoId, userId, comment);
  }

  @Get(':photoId/liked/:userId')
  async hasUserLikedPost(
    @Param('userId') userId: string,
    @Param('photoId') photoId: number,
  ): Promise<boolean> {
    return this.postService.hasUserLikedPost(userId, photoId);
  }
}
