/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readFileSync } from 'fs';
import { Server, ServerOptions, createServer } from 'spdy';
import * as express from 'express';
import { NestApplication, NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';

const key = readFileSync(path.join(__dirname, '../key.pem'));
const cert = readFileSync(path.join(__dirname, '../cert.pem'));
// import serveAutoPush from 'http2-express-autopush';

// const filesToPush = ['cat.webp'];

// main.ts
async function bootstrap() {
  const expressApp = express();

  // // expressApp.use(serveAutoPush(path.join(__dirname, '../public')));
  // expressApp.use((request, response, next) => {
  //   if (request.url === '/') {
  //     const file = readFileSync(path.join(__dirname, '../public/cat.webp'));

  //     // @ts-ignore
  //     response.push('/cat.webp', {}).end(file);
  //     next();
  //     return;
  //   }
  // });

  console.log(key, cert);

  const spdyOpts: ServerOptions = {
    key,
    cert,
    spdy: {
      protocols: ['h2'],
    },
  };

  const server: Server = createServer(spdyOpts, expressApp);

  const app: NestApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.init();
  console.log('Listening on port 3001');
  server.listen(3001);
}

bootstrap();
