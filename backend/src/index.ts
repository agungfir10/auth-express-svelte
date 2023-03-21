require('dotenv').config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { AppDataSource } from './data-source';
import { routes } from './routes';

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: ['http://localhost:8080'],
        credentials: true,
      })
    );

    routes(app);

    app.listen(8000, () => {
      console.log('listening to port 8000');
    });
  })
  .catch((err) => {});
