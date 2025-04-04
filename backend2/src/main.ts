import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());

  // Configuración básica de Swagger
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const config = new DocumentBuilder()
    .setTitle('API de Productos')
    .setDescription('API REST para gestión de productos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Habilitar CORS globalmente
  app.enableCors({
    origin: 'http://localhost:4200', // O un array de orígenes permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  await app.listen(port);
  console.log(`\x1b[32m[Nest] 🚀 Application is running on: http://localhost:${port}\x1b[0m`,);

  // Habilitar CORS si el frontend está en otro host
  app.enableCors();

}
bootstrap();
