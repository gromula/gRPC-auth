import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface AuthService {
  generateToken(data: { userId: string }): Observable<{ token: string }>;
}

@Injectable()
export class UserService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: 'src/auth.proto',
      url: 'auth-service:50051',
    },
  })
  private client: ClientGrpc;

  private authService: AuthService;
  private token: string | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
    this.requestNewToken();
  }

  async requestNewToken() {
    const userId = 'user-' + Math.floor(Math.random() * 1000);
    try {
      const response = await this.authService.generateToken({ userId });
      this.token = response.token;
      console.log(`New token received: ${this.token}`);
      setTimeout(() => this.requestNewToken(), 6000); // Odświeżenie tokena co 6s
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  }
}
