import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;
  login: string;
  role: string;
  id_client: number | null;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async genererToken(utilisateur: {
    id_utilisateur: number;
    login: string;
    role: string;
    id_client: number | null;
  }): Promise<string> {
    const payload: JwtPayload = {
      sub: utilisateur.id_utilisateur,
      login: utilisateur.login,
      role: utilisateur.role,
      id_client: utilisateur.id_client,
    };
    return this.jwtService.signAsync(payload);
  }

  async verifierToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}