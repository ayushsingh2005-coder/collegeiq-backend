import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import collegeRoutes from './routes/colleges';
import authRoutes from './routes/auth';
import savedRoutes from './routes/saved';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ 
  origin: [
    process.env.FRONTEND_URL || '*',
    'https://collegeiq-frontend.vercel.app',
    'https://collegeiq-frontend.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved', savedRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);