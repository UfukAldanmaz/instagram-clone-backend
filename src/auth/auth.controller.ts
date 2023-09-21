import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/sign-up')
  @Public()
  public async createUser(
    @Body() signUpDto: Record<string, any>
  ) {
    await this.authService.createUser(signUpDto.email, signUpDto.password);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('/login')
  // signIn(@Body() signInDto: Record<string, any>) {
  //   return this.authService.signIn(signInDto.username, signInDto.password);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Post('/login')
  // @Public()
  // signIn(@Body() signInDto: Record<string, any>) {
  //   return this.authService.signIn(signInDto.user);
  // }

  @Post('/login')
  @Public()
  async login(@Body() dto: Record<string, any>) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
