import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { headers: { authorization: string } }>();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      await this.authService.verifyToken(token);
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

/**
 * Guard is a class that implements the CanActivate interface.
 * If the guard returns true, the request is allowed to proceed.
 * If the guard returns false, the request is denied.
 * If the guard throws the error then the request is denied and the error is returned to the client.
 *
 * It must be injectable , and can be used by @UseGuards decorator.
 * It can be used at controller level , route level or even at the global level by app.useGlobalGuards(GuardName).
 *
 * In order to use the guard in other modules, we need to export the guard from the module (see auth.module.ts file).
 */
