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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async followUser(
    followerId: string,
    followingId: string,
  ): Promise<Following> {
    const follower = await this.userRepository.findOne({
      where: {
        id: followerId,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePictureUrl: true,
      },
    });
    const following = await this.userRepository.findOne({
      where: {
        id: followingId,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePictureUrl: true,
      },
    });
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
      relations: {
        follower: true,
        following: true,
      },
    });
  }

  async getFollowing(userId: string): Promise<Following[]> {
    return this.followingRepository.find({
      where: { follower: { id: userId } },
      relations: {
        follower: true,
        following: true,
      },
    });
  }

  async getFollowingByUsername(username: string): Promise<Following[]> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      // Handle the case where the user is not found
      return [];
    }

    return this.followingRepository.find({ where: { following: user } });
  }

  async getFollowersByUsername(username: string): Promise<Following[]> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      // Handle the case where the user is not found
      return [];
    }

    return this.followingRepository.find({ where: { follower: user } });
  }
}
