import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  surname: string;

  @IsString()
  name: string;

  @IsString()
  patronymic: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;
}
