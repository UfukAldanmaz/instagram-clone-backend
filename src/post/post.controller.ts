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
import { TimelineResponse } from 'src/timeline-response.dto';

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
    console.log('USERID', userId);

    // Call your service to get the timeline data
    const timelineData: TimelineResponse[] =
      await this.postService.getTimeline(userId);
    console.log('timelinedata', timelineData);

    return timelineData; // Return the timeline data as a response
  }
}
