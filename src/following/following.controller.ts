import {
  UseGuards,
  Controller,
  Post,
  Delete,
  Param,
  Request,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('following')
export class FollowingController {
  constructor(private followingService: FollowingService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':followingId')
  async followUser(
    @Request() request: any,
    @Param('followingId') followingId: string,
  ) {
    return await this.followingService.followUser(
      request.user.userId,
      followingId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':followingId')
  async unfollowUser(
    @Request() request: any,
    @Param('followingId') followingId: string,
  ) {
    return await this.followingService.unfollowUser(
      request.user.userId,
      followingId,
    );
  }
}
