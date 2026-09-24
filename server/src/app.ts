import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/booking';
import technicianRoutes from './routes/technicians';
import uploadRoutes from './routes/upload';

const app = express();

app.use(helmet());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/upload', uploadRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true
  }
});

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'SkillRelay API is running' });
});

// Attach io to app to use in controllers if needed
app.set('io', io);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
});

export { app, httpServer, io };



