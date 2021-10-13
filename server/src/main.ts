import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketAdapter } from './gateway/websocket.adapter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
    });
    app.enableCors({ origin: 'http://localhost:5000', credentials: true });
    app.use(cookieParser());
    app.useWebSocketAdapter(new SocketAdapter(app));
    await app.listen(3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
