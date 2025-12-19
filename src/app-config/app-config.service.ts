import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get MONGODB_URL(): string {
    return this.configService.get<string>('MONGODB_URL') as string;
  }

  get PORT(): number {
    return this.configService.get<number>('PORT') as number;
  }

  get JWT_SECRET(): string {
    return this.configService.get<string>('JWT_SECRET') as string;
  }

  get JWT_EXPIRY(): SignOptions['expiresIn'] {
    return (
      (this.configService.get<string>(
        'JWT_EXPIRY',
      ) as SignOptions['expiresIn']) || '1d'
    );
  }
}
