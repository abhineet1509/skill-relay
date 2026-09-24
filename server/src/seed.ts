import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserRole } from './models/User';
import { ENV } from './config/env';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...', ENV.MONGO_URI);
    await mongoose.connect(ENV.MONGO_URI);
    console.log('Connected.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Alice Smith (Tech)',
        email: 'alice.tech@example.com',
        passwordHash,
        role: UserRole.TECHNICIAN,
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?u=alice',
        status: 'ACTIVE'
      },
      {
        name: 'Bob Jones (Tech)',
        email: 'bob.tech@example.com',
        passwordHash,
        role: UserRole.TECHNICIAN,
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?u=bob',
        status: 'ACTIVE'
      },
      {
        name: 'Charlie Brown (Tech)',
        email: 'charlie.tech@example.com',
        passwordHash,
        role: UserRole.TECHNICIAN,
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?u=charlie',
        status: 'ACTIVE'
      },
      {
        name: 'Test Customer',
        email: 'customer@example.com',
        passwordHash,
        role: UserRole.CUSTOMER,
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?u=customer',
        status: 'ACTIVE'
      }
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
