import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  // Index,
} from 'typeorm';
import { Photo } from './photo.entity';
import { RefreshToken } from './refresh-tokens.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  // @Index({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Column({ name: 'email', nullable: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'password', nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
  updateOne: any;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  refresh_token: RefreshToken[];
}
