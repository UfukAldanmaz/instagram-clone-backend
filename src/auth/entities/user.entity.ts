import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  // Index,
} from 'typeorm';

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
}
