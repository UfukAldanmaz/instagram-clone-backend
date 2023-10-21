import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('');

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('4');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      });

      request['user'] = { userId: payload.sub, email: payload.email };
      console.log('REFRESHTOKEN', payload);
    } catch {
      console.log('5');
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('RTtype', type, 'RTtoken', token);

    return type === 'Bearer' ? token : undefined;
  }
}
