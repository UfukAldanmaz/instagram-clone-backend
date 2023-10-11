import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Following {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
  following: User;
}