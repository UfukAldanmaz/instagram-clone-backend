import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/create-user')
  public async createUser(
    @Param('username') username: string,
    @Param('password') password: string,
  ) {
    await this.authService.createUser(username, password);
  }
}
