import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;
}
