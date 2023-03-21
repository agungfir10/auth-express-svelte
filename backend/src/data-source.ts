import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Reset } from './entity/Reset';
import { Token } from './entity/Token';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'secret',
  database: 'my_database',
  synchronize: true,
  logging: false,
  entities: [User, Reset, Token],
  subscribers: [],
  migrations: [],
});
