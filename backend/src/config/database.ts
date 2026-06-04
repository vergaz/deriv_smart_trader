import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { DerivAccount } from '../models/DerivAccount';
import { Trade } from '../models/Trade';
import { Signal } from '../models/Signal';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, DerivAccount, Trade, Signal],
  subscribers: [],
  migrations: [],
});
