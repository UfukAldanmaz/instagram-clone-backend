import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/auth/entities/photo.entity';
import { User } from 'src/auth/entities/user.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { HttpModule } from '@nestjs/axios';
import { Following } from 'src/auth/entities/following.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Photo, Following]), HttpModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
