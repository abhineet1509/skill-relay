const fs = require('fs');

function clean(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/₹/g, 'Rs. ')
      .replace(/â‚¹/g, 'Rs. ')
      .replace(/—/g, '-')
      .replace(/â€”/g, '-')
      .replace(/–/g, '-')
      .replace(/â€“/g, '-')
      .replace(/⭐/g, '')
      .replace(/✓/g, '')
      .replace(/Ã¢Å“â€œ/g, '')
      .replace(/Ã¢Â­Â /g, '')
      .replace(/📍/g, '')
      .replace(/🔧/g, '')
      .replace(/⏱/g, '')
      .replace(/🎯/g, '')
      .replace(/💼/g, '')
      .replace(/←/g, '<-')
      .replace(/\?/g, ''); // just remove ? in emails if they were placeholders
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Cleaned', file);
    }
  } catch(e) {}
}

const files = [
  'client/src/pages/Matches.tsx',
  'client/src/pages/TechnicianDashboard.tsx',
  'client/src/pages/TechnicianProfile.tsx',
  'client/src/pages/CustomerDashboard.tsx',
  'server/src/services/emailService.ts',
  'server/src/routes/booking.ts'
];

files.forEach(clean);
