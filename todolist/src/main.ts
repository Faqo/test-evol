import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Permitir peticiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true
  });
  
  // Validar automáticamente los DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API corriendo en: http://localhost:${port}`);
}

bootstrap();