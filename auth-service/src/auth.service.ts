import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;

  constructor(private configService: ConfigService) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET', 'supersecret');
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '5s' });
  }
}
