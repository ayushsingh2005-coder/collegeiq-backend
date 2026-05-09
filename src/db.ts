import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT colleges_name_unique UNIQUE (name)
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

  await query(`
    CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(location);
    CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating DESC);
    CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges(fees);
    CREATE INDEX IF NOT EXISTS idx_colleges_placement ON colleges(placement_percentage DESC);
    CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
  `);

  console.log('Database initialized');
};

export default pool;