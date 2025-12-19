import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting the global prefix
  app.setGlobalPrefix('/api/v1', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ], // Exclude the root route
  });

  app.useGlobalPipes(new ValidationPipe({}));

  // Getting the app config service
  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.PORT);
}
bootstrap();
