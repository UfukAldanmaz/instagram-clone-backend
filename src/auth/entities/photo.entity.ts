import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
  @OneToMany(() => Like, (like) => like.photo, { cascade: true })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  // @ManyToMany(() => User, (user) => user.likedPhotos)
  // @JoinTable({ name: 'user_likes_photo' })
  // likedBy: User[];
}
