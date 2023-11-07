import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Photo } from 'src/auth/entities/photo.entity';
import { User } from 'src/auth/entities/user.entity';
import { In, Repository } from 'typeorm';
import * as FormData from 'form-data';
import { Following } from 'src/auth/entities/following.entity';
import { TimelineResponse } from 'src/timeline-response.dto';
import { Like } from 'src/auth/entities/like.entity';
import { Comment } from 'src/auth/entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,

    @InjectRepository(Following)
    private followingRepository: Repository<Following>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    private httpService: HttpService,
  ) {}

  async uploadPhoto(photo: Express.Multer.File, id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw 'User not found';
      }

      const formData = new FormData();
      formData.append('image', photo.buffer.toString('base64'));

      // console.log('KEY', process.env.IMG_API_KEY);

      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?key=${'dfaa2b440b67524314651b73275a6e22'}`,
            formData,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );
      const newPhoto = new Photo();
      newPhoto.url = imageData.data.url;
      newPhoto.user = user;

      await this.photoRepository.save(newPhoto);
      return newPhoto;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async list(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        photos: true,
      },
    });
    if (!user) {
      throw 'User not found';
    }
    return user.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      username: user.username,
    }));
  }

  async listUserPost(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        photos: true,
      },
    });
    if (!user) {
      throw 'User not found';
    }

    return user.photos;
  }

  async getTimeline(userId: string): Promise<TimelineResponse[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        photos: {
          likes: {
            user: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followingUsers = await this.followingRepository.find({
      where: { follower: { id: userId } },
      relations: {
        following: true,
      },
    });

    const followingUserIds = followingUsers.map((user) => user.following.id);
    const followingPhotos = await this.photoRepository.find({
      where: { user: In(followingUserIds) },
      relations: {
        user: true,
        likes: {
          user: true,
        },
      },
    });

    const combinedPhotos: TimelineResponse[] = user.photos.map((photo) => {
      const hasLiked = photo.likes.some((like) => like.user.id === userId);

      return {
        id: photo.id,
        url: photo.url,
        user: {
          id: user.id,
          username: user.username,
          profilePictureUrl: user.profilePictureUrl,
        },
        likes: photo.likes.map((item) => ({
          id: item.user.id,
          username: item.user.username ?? '',
          profilePictureUrl: item.user.profilePictureUrl,
        })),
        hasLiked: hasLiked,
      };
    });

    followingPhotos.forEach((photo) => {
      const hasLiked = photo.likes.some((like) => like.user.id === userId);
      combinedPhotos.push({
        id: photo.id,
        url: photo.url,
        user: {
          id: photo.user.id,
          username: photo.user.username,
          profilePictureUrl: photo.user.profilePictureUrl,
        },
        likes: photo.likes.map((item) => ({
          id: item.user.id,
          username: item.user.username ?? '',
          profilePictureUrl: item.user.profilePictureUrl,
        })),
        hasLiked: hasLiked,
      });
    });

    return combinedPhotos;
  }

  async likePhoto(userId: string, photoId: number): Promise<Like> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: { likes: true },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profilePictureUrl: true,
      },
    });

    if (!photo || !user) {
      throw new NotFoundException('Photo or user not found');
    }

    const like = new Like();
    like.user = user;
    like.photo = photo;
    console.log('newlike', like);
    console.log('like.user', like.user);
    console.log('like.photo', like.photo);

    return await this.likeRepository.save(like);
  }

  async unlikePhoto(userId: string, photoId: number): Promise<void> {
    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('user = :userId', { userId })
      .andWhere('photo = :photoId', { photoId })
      .execute();
  }

  async getLikedByUsers(photoId: number): Promise<Like[]> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: { likes: true },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    console.log('likes', photo.likes);

    return photo.likes;
  }

  async hasUserLikedPost(userId: string, photoId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        photo: { id: photoId },
      },
    });
    return !!like;
  }

  async addComment(
    photoId: number,
    userId: string,
    comment: string,
  ): Promise<Comment> {
    const photo = await this.photoRepository.findOne({
      where: {
        id: photoId,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!photo || !user) {
      throw new NotFoundException('Photo or user not found');
    }

    const newComment = new Comment();
    newComment.user = user;
    newComment.photo = photo;
    newComment.comment = comment;

    return await this.commentRepository.save(newComment);
  }
}
