const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const newOtp = '123456';
  const newExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  
  const result = await mongoose.connection.collection('users').updateOne(
    { email: '2311201126@stu.manit.ac.in' },
    { $set: { otp: newOtp, otpExpires: newExpiry } }
  );
  
  console.log('Updated:', result.modifiedCount, 'user(s)');
  console.log('Your OTP is now: 123456');
  console.log('Valid for 30 minutes');
  process.exit(0);
}).catch(e => { 
  console.error(e); 
  process.exit(1); 
});
