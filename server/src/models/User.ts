import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  skill?: string;
  experience?: string;
  city?: string;
  location?: { type: string; coordinates: number[] };
  status: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  refreshToken?: string;
  addresses?: Array<{title: string, text: string}>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    avatar: { type: String },
    skill: { type: String },
    experience: { type: String },
    city: { type: String },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
    status: { type: String, default: 'ACTIVE' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    refreshToken: { type: String },
    addresses: [{ title: String, text: String }],
  },
  { timestamps: true }
);

UserSchema.index({ location: '2dsphere' });

export const User = mongoose.model<IUser>('User', UserSchema);

