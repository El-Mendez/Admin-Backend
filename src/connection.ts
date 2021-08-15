import { Pool } from 'pg';
import {
  DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER, DATABASE_NAME,
} from './constants';

export const connection: Pool = new Pool({
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  user: DATABASE_USER,
  database: DATABASE_NAME,
});

export default connection;
