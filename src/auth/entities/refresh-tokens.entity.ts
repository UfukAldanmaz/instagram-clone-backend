import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'value', nullable: false })
  value: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'userId', nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'expires', nullable: false })
  expires: Date;

  @Column({ name: 'replacedBy', nullable: true })
  replacedBy: string;
  @ManyToOne(() => User, (user) => user.refresh_token)
  user: User;
}
