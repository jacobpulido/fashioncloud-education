import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { Handler } from '@vercel/node';
import { AppModule } from './app.module';

let cachedApp: any;

async function createApp() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: process.env.CORS_ORIGIN || '*', credentials: true });
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await createApp();
  const httpAdapter = app.getHttpAdapter();
  return httpAdapter.getInstance()(req, res);
}

// Local development
if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: process.env.CORS_ORIGIN || '*', credentials: true });
    await app.listen(process.env.PORT || 3001);
    console.log(`FashionCloud Education API running on port ${process.env.PORT || 3001}`);
  }
  bootstrap();
}
// build: fixed rootDirectory


