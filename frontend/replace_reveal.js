const fs = require('fs');
const path = require('path');

const dir = '/Users/milquu/new-interior-website/frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace className="... reveal ..." with reveal-stagger on div, section, figure
  // A regex that matches <div ... className="... reveal ...">
  // We can just replace ' reveal"' with ' reveal-stagger"' and 'reveal ' with 'reveal-stagger '
  // But ONLY for containers.
  // Actually, let's just do a blanket replace of "reveal" with "reveal-stagger" 
  // and then revert it for specific inline/text tags.
  
  content = content.replace(/\breveal\b/g, 'reveal-stagger');

  // Revert for <p>, <img>, <span>, <a>, <h1>...<h6>, <button>
  // Regex to find <p ... className="... reveal-stagger ..."> and replace with reveal
  const revertTags = ['p', 'img', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button'];
  
  revertTags.forEach(tag => {
    const regex = new RegExp(`(<${tag}\\b[^>]*className="[^"]*)\\breveal-stagger\\b([^"]*")`, 'g');
    content = content.replace(regex, '$1reveal$2');
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

// Also update Footer.jsx
const footerPath = '/Users/milquu/new-interior-website/frontend/src/components/Footer.jsx';
let footerContent = fs.readFileSync(footerPath, 'utf8');
footerContent = footerContent.replace(/\breveal\b/g, 'reveal-stagger');
fs.writeFileSync(footerPath, footerContent, 'utf8');
console.log('Updated Footer.jsx');
