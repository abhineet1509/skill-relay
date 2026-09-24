import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  technicianEmail: string;
  technicianName: string;
  skill: string;
  cost: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    technicianEmail: { type: String, required: true },
    technicianName: { type: String, required: true },
    skill: { type: String, required: true },
    cost: { type: String },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
