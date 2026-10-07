import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;
  login: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Génère un token JWT à partir des infos utilisateur
   */
  async genererToken(utilisateur: {
    id_utilisateur: number;
    login: string;
    role: string;
  }): Promise<string> {
    const payload: JwtPayload = {
      sub: utilisateur.id_utilisateur,
      login: utilisateur.login,
      role: utilisateur.role,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * Vérifie et décode un token JWT
   */
  async verifierToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}