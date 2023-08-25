import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL.replace('postgresql', 'mysql');
const client = mysql.createPool(url);

export default client;