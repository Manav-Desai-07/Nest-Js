import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('Log');
    this.logger.debug('debug');
    this.logger.error('error');
    this.logger.fatal('fatal');
    this.logger.verbose('verbose');
    this.logger.warn('warn');
    return this.appService.getHello();
  }
}
