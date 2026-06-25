import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import blogRoutes from './routes/blog';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import ogRoutes from './routes/og';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);

// OG tag proxy for social media bots (image proxy + bot-served HTML)
app.use('/api/og', ogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
