import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as FormData from 'form-data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      console.log('7');

      throw 'User not found';
    }

    return user;
  }
  async getUserProfile(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePictureUrl: true,
      },
    });
  }
  async uploadAvatar(photo: Express.Multer.File, id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        select: {
          id: true,
          username: true,
          bio: true,
          profilePictureUrl: true,
        },
      });
      if (!user) {
        console.log('8');

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
      user.profilePictureUrl = imageData.data.url;

      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
