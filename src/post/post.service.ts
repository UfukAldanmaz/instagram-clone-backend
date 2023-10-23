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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,

    @InjectRepository(Following)
    private followingRepository: Repository<Following>,

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
        console.log('1');

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
      console.log('2');

      throw 'User not found';
    }

    return user.photos;
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
      console.log('3');

      throw 'User not found';
    }

    return user.photos;
  }

  async getTimeline(userId: string): Promise<TimelineResponse[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        photos: true,
      },
    });

    if (!user) {
      console.log('4');

      throw new NotFoundException('User not found');
    }
    console.log('user', user);

    // Get the IDs of users that the current user is following
    const followingUsers = await this.followingRepository.find({
      where: { follower: { id: userId } },
      relations: {
        following: true,
      },
    });
    console.log('followingusers', followingUsers);

    // Get posts from the users the current user is following
    const followingUserIds = followingUsers.map((user) => user.following.id);
    const followingPhotos = await this.photoRepository.find({
      where: { user: In(followingUserIds) },
      relations: {
        user: true,
      }, // Include the user relation
    });

    // Create an array of TimelineResponse objects
    const combinedPhotos: TimelineResponse[] = user.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      user: {
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
      },
    }));

    followingPhotos.forEach((photo) => {
      combinedPhotos.push({
        id: photo.id,
        url: photo.url,
        user: {
          id: photo.user.id,
          username: photo.user.username,
          profilePictureUrl: photo.user.profilePictureUrl,
        },
      });
    });

    return combinedPhotos;
  }

  // async getTimeline(userId: string): Promise<Photo[]> {
  //   // Get user's own posts
  //   console.log('Received userId: ' + userId);

  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['photos'],
  //   });

  //   if (!user) {
  //     console.log('User not found for userId: ' + userId);

  //     throw new NotFoundException('User not found');
  //   }

  //   const userPhotos = user.photos;

  //   // Get the IDs of users that the current user is following
  //   const followingUsers = await this.followingRepository.find({
  //     where: { follower: { id: userId } },
  //     select: ['following'],
  //   });

  //   // Get posts from the users the current user is following
  //   const followingUserIds = followingUsers.map((user) => user.following.id);
  //   const followingPhotos = await this.photoRepository.find({
  //     where: { user: In(followingUserIds) },
  //     relations: ['user'], // Include the user relation
  //   });

  //   // Combine the user's own posts and the posts from followings
  //   const combinedPhotos = [...userPhotos, ...followingPhotos];
  //   console.log(combinedPhotos);

  //   return combinedPhotos;
  // }
}

//paramtredeki userID'nin takip ettiği userId'leri al
//photo tablosundan bu userId'lerin postlarını çek ve return et
