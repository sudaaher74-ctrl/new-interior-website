import fs from 'fs/promises';
import path from 'path';

const dirs = [
  './src/pages/Home.jsx',
  './src/pages/Contact.jsx',
  './src/pages/Process.jsx',
  './src/pages/About.jsx',
  './src/components/Photo.jsx',
  './src/pages/Portfolio.jsx',
  './src/pages/ProjectDetail.jsx'
];

async function check() {
  for (const f of dirs) {
    try {
      const p = path.join(process.cwd(), f);
      const content = await fs.readFile(p, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('<img') && !line.includes('loading="lazy"')) {
          console.log(`Found in ${f}:${i + 1} -> ${line.trim()}`);
        }
      });
    } catch(e) {}
  }
}

check();
