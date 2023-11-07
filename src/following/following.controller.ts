import {
  UseGuards,
  Controller,
  Post,
  Delete,
  Param,
  Request,
  Get,
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getFollowing(@Request() request: any) {
    return this.followingService.getFollowing(request.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/followers')
  async getFollowers(@Request() request: any) {
    return this.followingService.getFollowers(request.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/:username/following')
  async getFollowingByUsername(@Param('username') username: string) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:username/followers')
  async getFollowersByUsername(@Param('username') username: string) {}
}
