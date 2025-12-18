import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';

@Controller('auth') // Common prefix for this controller's routes : /auth/...
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register') // Route handler for POST /auth/register
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
