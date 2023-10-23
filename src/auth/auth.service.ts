import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

// Entities
import { User } from './entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async createUser(email: string, password: string, username: string) {
    if (await this.repository.exist({ where: { email: email } })) {
      throw new Error('Email already exists');
    }
    if (await this.repository.exist({ where: { username: username } })) {
      throw new Error('Username already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser: User = this.repository.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    await this.repository.save(newUser);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.repository.findOne({
      where: {
        email: email,
      },
    });

    if (!(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  public async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '5d' }),
    };
  }

  public async logout(id: string): Promise<{ status: boolean }> {
    await this.refreshTokenRepository.delete({ id });
    return { status: true };
  }

  public async refreshToken(userId: any) {
    const user = await this.repository.findOne({
      where: {
        id: userId,
      },
    });
    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload);
    return {
      access_token: newAccessToken,
    };
  }
}
