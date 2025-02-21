import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'GenerateToken')
  generateToken(data: { userId: string }): { token: string } {
    return { token: this.authService.generateToken(data.userId) };
  }
}
