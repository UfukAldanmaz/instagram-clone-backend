import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Following } from 'src/auth/entities/following.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(Following)
    private followingRepository: Repository<Following>,
  ) {}

  async followUser(
    followerId: string,
    followingId: string,
  ): Promise<Following> {
    const follower = new User();
    follower.id = followerId;

    const following = new User();
    following.id = followingId;

    const follow = new Following();
    follow.follower = follower;
    follow.following = following;

    return this.followingRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.followingRepository
      .createQueryBuilder()
      .delete()
      .from(Following)
      .where('follower = :followerId', { followerId })
      .andWhere('following = :followingId', { followingId })
      .execute();
  }

  async getFollowers(userId: string): Promise<Following[]> {
    return this.followingRepository.find({
      where: { following: { id: userId } },
    });
  }

  async getFollowing(userId: string): Promise<Following[]> {
    return this.followingRepository.find({
      where: { follower: { id: userId } },
    });
  }
}
