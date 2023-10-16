import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  // Index,
} from 'typeorm';
import { Photo } from './photo.entity';
import { RefreshToken } from './refresh-tokens.entity';
import { Following } from './following.entity';

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

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'bio', nullable: true })
  bio: string;

  @Column({ name: 'profilePictureUrl', nullable: true })
  profilePictureUrl: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  refresh_token: RefreshToken[];

  @ManyToMany(() => Following, (following) => following.follower)
  @JoinTable({ name: 'user_following' })
  following: Following[];

  @ManyToMany(() => Following, (followers) => followers.following)
  @JoinTable({ name: 'user_followers' })
  followers: Following[];
}
