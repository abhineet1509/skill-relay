const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log('Total users in DB:', users.length);
  console.log('\n--- All Users ---');
  users.forEach(u => {
    console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Verified: ${u.isVerified}`);
  });

  // Also list all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n--- All Collections ---');
  collections.forEach(c => console.log(' -', c.name));

  process.exit(0);
}).catch(e => { console.error('DB Error:', e.message); process.exit(1); });
