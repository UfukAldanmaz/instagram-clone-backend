import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @Public()
  public async createUser(@Body() signUpDto: Record<string, any>) {
    await this.authService.createUser(
      signUpDto.email,
      signUpDto.password,
      signUpDto.username,
    );
  }

  @Post('/login')
  @Public()
  async login(@Body() dto: Record<string, any>) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.signIn(user);
  }

  @Post('/logout')
  @UseGuards(RefreshJwtAuthGuard)
  async logout(@Request() req) {
    const userId = req.user.userId;
    const logoutStatus = await this.authService.logout(userId);
    if (logoutStatus.status) {
      return { message: 'Logout successful' };
    } else {
      return { message: 'Logout failed' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh')
  async refreshToken(@Request() request: any) {
    const userId = request.user.userId;
    return this.authService.refreshToken(userId);
  }
}
