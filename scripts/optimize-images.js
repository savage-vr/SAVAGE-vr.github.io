const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const dirs = ['members', 'slide'];

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Optimizing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);
    
    let pipeline = image;
    
    // Resize if image is too large
    if (metadata.width > 1920 || metadata.height > 1920) {
      pipeline = pipeline.resize(1920, 1920, { 
        fit: 'inside', 
        withoutEnlargement: true 
      });
    }
    
    // Convert to WebP for better compression (except for profile images)
    if (inputPath.includes('/slide/')) {
      await pipeline
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      // Also keep original format with compression
      await pipeline
        .jpeg({ quality: 85, progressive: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
    } else {
      // For member images, keep original format but optimize
      await pipeline
        .jpeg({ quality: 90, progressive: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
    }
    
    console.log(`✓ Optimized: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirName) {
  const inputDir = path.join(publicDir, dirName);
  const outputDir = path.join(publicDir, `${dirName}-optimized`);
  
  if (!fs.existsSync(inputDir)) {
    console.log(`Directory ${inputDir} does not exist, skipping...`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && 
    !file.includes('Zone.Identifier')
  );
  
  console.log(`\nProcessing ${imageFiles.length} images in ${dirName}/`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    await optimizeImage(inputPath, outputPath);
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  
  for (const dir of dirs) {
    await processDirectory(dir);
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Review optimized images in *-optimized directories');
  console.log('2. Replace original directories if satisfied with results');
  console.log('3. Update component imports if using WebP format');
}

main().catch(console.error);