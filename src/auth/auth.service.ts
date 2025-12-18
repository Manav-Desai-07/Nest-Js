import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * 1. Check the email already exists
   * 2. Hash the password
   * 3. Store the user in the db
   * 4. Generate jwt token
   * 5. send token in response
   */
  registerUser(registerDto: RegisterDto) {
    console.log(registerDto);
    return this.userService.createUser();
  }
}
