import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export const initDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS colleges (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      fees INTEGER NOT NULL,
      rating DECIMAL(3,1) NOT NULL,
      courses TEXT[] NOT NULL,
      placement_percentage INTEGER,
      overview TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS saved_colleges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
      UNIQUE(user_id, college_id)
    );
  `);
  console.log('Database initialized');
};

export default pool;