import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar parsers de body
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  
  // Habilitar CORS
  app.enableCors();
  
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
 
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 Body parsers configured`);
  
  await app.listen(port);
}
bootstrap();
