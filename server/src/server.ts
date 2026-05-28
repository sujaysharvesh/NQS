import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import { seedDatabase } from './seed';

import authRoutes   from './routes/auth.routes';
import userRoutes   from './routes/user.routes';
import recordRoutes from './routes/record.routes';

const app  = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/auth',    authRoutes);
app.use('/api/users',   userRoutes);
app.use('/api/records', recordRoutes);


app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


const startServer = async (): Promise<void> => {
  await connectDB();      
  await seedDatabase();  

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
