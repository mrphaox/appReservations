// auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    let user: { password: string; toObject: () => any } | null = null;
    const emailRegex = /\S+@\S+\.\S+/;
    const isEmail = emailRegex.test(login);

    if (isEmail) {
    user = await this.usersService.findByEmail(login);
    } else {
    user = await this.usersService.findByUsername(login);
    }
    if (!user) {
      throw new UnauthorizedException('Usuario/Email no encontrado');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const { password, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
