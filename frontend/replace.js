import fs from 'fs/promises';
import path from 'path';

const dirs = [
  './index.html',
  './src/pages/Home.jsx',
  './src/pages/Contact.jsx',
  './src/pages/Process.jsx',
  './src/pages/About.jsx',
  './src/components/Photo.jsx'
];

async function replace() {
  for (const f of dirs) {
    const p = path.join(process.cwd(), f);
    let content = await fs.readFile(p, 'utf8');
    content = content.replace(/\.(jpeg|jpg|JPG)/g, '.webp');
    await fs.writeFile(p, content);
    console.log(`Updated ${f}`);
  }
}

replace();
