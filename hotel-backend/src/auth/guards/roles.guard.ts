import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupère la liste des rôles autorisés pour cette route
    const rolesRequis = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si pas de @Roles() sur la route → autorise
    if (!rolesRequis || rolesRequis.length === 0) {
      return true;
    }

    // 3. Récupère l'utilisateur depuis la requête (injecté par JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // 4. Vérifie que le rôle de l'utilisateur est dans la liste autorisée
    const autorise = rolesRequis.includes(user.role);
    if (!autorise) {
      throw new ForbiddenException(
        `Accès refusé : rôle "${user.role}" non autorisé. Requis : ${rolesRequis.join(', ')}`,
      );
    }

    return true;
  }
}