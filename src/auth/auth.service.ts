import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '__generated__';
@Injectable()
export class AuthService {
  public constructor(private userService: UserService) {}

  public async register(dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException('User with this email already exists');
    }
    const newUser = await this.userService.createUser(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    return this.saveSession(newUser);
  }

  public async saveSession(user: User) {
    return console.log('Save session for user', user);
  }
}
