import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt'

// Entities
import { User } from './entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  public async createUser(username: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser: User = this.repository.create({
      username: username,
      password: hashedPassword,
    });

    await this.repository.save(newUser);
  }

  public async signIn(username: string, pass: string): Promise<any> {
    const user = await this.repository.findOne({
      where: {
        username: username
      }
    });
    if (bcrypt.compare(pass, user?.password)) {
      throw new UnauthorizedException();

    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
