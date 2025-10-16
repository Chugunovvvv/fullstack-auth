import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ms } from './libs/common/utils/ms-util';
import { parseBoolean } from './libs/common/utils/parse-boolean';
import session from 'express-session';
import IORedis from 'ioredis';
import connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  // Создаём Redis-клиент
  const redisClient = new IORedis(config.getOrThrow<string>('REDIS_URI'));

  // Обработка событий
  redisClient.on('error', (err) =>
    console.error('Redis connection error:', err),
  );
  redisClient.on('connect', () => console.log('Connected to Redis'));
  redisClient.on('ready', () => console.log('Redis is ready'));

  // Инициализируем RedisStore
  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: config.getOrThrow<string>('SESSION_FOLDER'),
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      store: redisStore,
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.get<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
