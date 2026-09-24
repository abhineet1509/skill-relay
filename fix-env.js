const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('e:/SKILL RELAY/client/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace simple strings: 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/...`
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  // Replace template literals: `http://localhost:5000/api/...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/...`
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
