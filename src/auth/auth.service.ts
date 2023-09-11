import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Entities
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  public async createUser(username: string, password: string) {
    const newUser: User = this.repository.create({
      username: username,
      password: password,
    });

    await this.repository.save(newUser);
  }
}
