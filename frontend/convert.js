import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'public/images');

async function convertToWebp() {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(directoryPath, file);
        const outputPath = path.join(directoryPath, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        console.log(`Converting ${file}...`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Deleting ${file}...`);
        await fs.unlink(inputPath);
      }
    }
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  }
}

convertToWebp();
