import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('The application is running in mock mode. Please set MONGO_URI in .env');
  }
};
