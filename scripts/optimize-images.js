import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { globSync } from 'glob';

const rootDir = path.join(process.cwd()); // project root
const legacyDirs = [
  path.join(rootDir, 'old', 'botgadalka', 'css', 'cards'),
  path.join(rootDir, 'old', 'gadalkaaaaa', 'css', 'cards'),
  path.join(rootDir, 'old', 'botgadalka', 'css', 'textures'),
  path.join(rootDir, 'old', 'gadalkaaaaa', 'css', 'textures'),
];


const outputDir = path.join(rootDir, 'public');
const cardsOutput = path.join(outputDir, 'cards');
const texturesOutput = path.join(outputDir, 'textures');

// Ensure output folders exist
for (const dir of [cardsOutput, texturesOutput]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimize(file, destination) {
  const ext = path.extname(file).toLowerCase();
  const fileName = path.basename(file, ext) + '.jpg';
  const outPath = path.join(destination, fileName);

  // Skip if already processed & up to date
  if (fs.existsSync(outPath)) {
    const srcStat = fs.statSync(file);
    const dstStat = fs.statSync(outPath);
    if (dstStat.mtime >= srcStat.mtime) {
      return;
    }
  }

  try {
    await sharp(file)
      .rotate()
      .jpeg({ quality: 70, progressive: true })
      .toFile(outPath);
    console.log('Optimized', outPath);
  } catch (err) {
    console.error('Error optimizing', file, err);
  }
}

(async () => {
  for (const dir of legacyDirs) {
    const destination = dir.includes('textures') ? texturesOutput : cardsOutput;
    const pattern = path.join(dir, '**', '*.{png,jpg,jpeg}');
    const files = globSync(pattern.replace(/\\/g, '/'));
    for (const file of files) {
      await optimize(file, destination);
    }
  }
})(); 