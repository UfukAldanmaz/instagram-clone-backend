import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { User } from 'src/auth/entities/user.entity';
import { Following } from 'src/auth/entities/following.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Following])],
  providers: [FollowingService],
  controllers: [FollowingController],
  exports: [FollowingService],
})
export class FollowingModule {}
