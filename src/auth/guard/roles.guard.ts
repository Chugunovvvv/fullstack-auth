import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '__generated__';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getClass(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    if (!roles) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
