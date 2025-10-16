import { isPasswordMatchingConstraint } from '@/libs/common/decorators/is-password-matching-constraint';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @IsString({ message: 'Пароль подтверждения должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль подтверждения не должен быть пустым' })
  @MinLength(6, {
    message: 'Пароль подтверждения должен быть не менее 6 символов',
  })
  @Validate(isPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
  passwordRepeat: string;
}
