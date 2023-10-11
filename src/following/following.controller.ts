import { Controller, Post, Delete, Param } from '@nestjs/common';
import { FollowingService } from './following.service';

@Controller('following')
export class FollowingController {
  constructor(private followingService: FollowingService) {}
  @Post(':followerId/:followingId')
  async followUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followingService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  async unfollowUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followingService.unfollowUser(followerId, followingId);
  }
}
