import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const client = mysql.createPool(process.env.DATABASE_URL);

export default client;