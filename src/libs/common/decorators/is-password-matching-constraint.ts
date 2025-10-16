import { RegisterDto } from '@/auth/dto/register.dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class isPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    return object.password === passwordRepeat;
  }

  public defaultMessage(args?: ValidationArguments) {
    return 'Пароли не совпадают';
  }
}
