import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly user;

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {
    this.user = this.database.db.orm.public.User;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.user
      .where({ email: dto.email })
      .first();

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.user.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return this.createToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.user
      .where({ email: dto.email })
      .first();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createToken(user);
  }

  private async createToken(user: {
    id: number;
    email: string;
    name: string | null;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}