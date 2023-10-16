import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
