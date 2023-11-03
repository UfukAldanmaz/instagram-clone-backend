import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { HttpModule } from '@nestjs/axios';
import { Following } from 'src/auth/entities/following.entity';
import { Photo } from 'src/auth/entities/photo.entity';
import { Like } from 'src/auth/entities/like.entity';
import { Comment } from 'src/auth/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Photo, Following, Like, Comment]),
    HttpModule,
  ],
  providers: [UsersService, PostService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
