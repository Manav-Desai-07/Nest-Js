import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 1. Check the email already exists
   * 2. Hash the password
   * 3. Store the user in the db
   * 4. Generate jwt token
   * 5. send token in response
   */
  async registerUser(registerDto: RegisterDto) {
    const password = await bcrypt.hash(registerDto.password, 10);
    const createdUser = await this.userService.createUser({
      ...registerDto,
      password,
    });

    const token = await this.jwtService.signAsync({
      sub: createdUser._id,
    });

    return {
      access_token: token,
    };
  }

  async loginUser(loginDto: LoginUserDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.jwtService.signAsync({
      sub: user._id,
    });

    return {
      access_token: token,
    };
  }

  async verifyToken(token: string): Promise<object> {
    return await this.jwtService.verifyAsync<object>(token);
  }
}
