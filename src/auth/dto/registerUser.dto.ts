import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'First name must be a string' })
  fname: string;

  @IsString({ message: 'Last name must be a string' })
  lname: string;

  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;
}
