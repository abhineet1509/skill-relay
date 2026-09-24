const fs = require('fs');
const path = require('path');

const replacements = {
  'â‚¹': '₹',
  'â€”': '—',
  'â€“': '–',
  'â€¢': '•',
  'Ã¢Å“â€œ': '✓',
  'Ã¢Â­Â': '⭐',
  'Ã°Å¸â€œÂ': '📍',
  'Ã°Å¸â€ Â§': '🔧',
  'Ã¢ÂÂ±': '⏱',
  'Ã°Å¸Å½Â¯': '🎯',
  'Ã°Å¸â€™Â¼': '💼',
  'Ã¢â€ Â': '←',
  'Ã¢â‚¬â€œ': '–',
  'Ã¢â‚¬â€': '—',
  'Ã¢â€šÂ¹': '₹',
  ',1': '₹',
  '?': '₹', // Be careful, only exact match '? ' where it makes sense? No, let's skip '?' to avoid corrupting actual question marks.
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = [...walkDir('e:/SKILL RELAY/client/src'), ...walkDir('e:/SKILL RELAY/server/src')];

let filesChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [bad, good] of Object.entries(replacements)) {
    if (bad === '?') continue; // Skipping wildcard replacements
    const regex = new RegExp(bad, 'g');
    content = content.replace(regex, good);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed encoding in:', file);
    filesChanged++;
  }
});

console.log(`Finished scanning. Fixed ${filesChanged} files.`);
