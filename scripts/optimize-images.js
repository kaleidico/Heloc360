const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
  {
    input: 'home-hero.jpg',
    output: 'home-hero.webp',
    width: 1920,
    quality: 80
  },
  {
    input: 'home-what-is-a-heloc360.jpg',
    output: 'home-what-is-a-heloc360.webp',
    width: 1200,
    quality: 80
  }
];

async function optimizeImages() {
  for (const image of images) {
    const inputPath = path.join(imagesDir, image.input);
    const outputPath = path.join(outputDir, image.output);
    
    if (fs.existsSync(inputPath)) {
      console.log(`Optimizing ${image.input}...`);
      
      await sharp(inputPath)
        .resize(image.width, null, { withoutEnlargement: true })
        .webp({ quality: image.quality })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${image.input} -> ${image.output}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
      console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
      console.log(`   Savings: ${savings}%\n`);
    }
  }
}

optimizeImages().catch(console.error); 