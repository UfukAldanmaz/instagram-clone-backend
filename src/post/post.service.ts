import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Photo } from 'src/auth/entities/photo.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as FormData from 'form-data';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
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

      console.log('KEY', process.env.IMG_API_KEY);

      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?expiration=600&key=${'dfaa2b440b67524314651b73275a6e22'}`,
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
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
