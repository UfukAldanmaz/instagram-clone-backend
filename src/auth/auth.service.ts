import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


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

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.repository.findOne({
      where: {
        username: username
      }
    });

    if (!(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }
    console.log('User authenticated:', user);
    return user;
  }

  public async signIn(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
