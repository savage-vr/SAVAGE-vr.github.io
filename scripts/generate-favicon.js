const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const inputLogo = path.join(__dirname, '../public/logo.png')
const publicDir = path.join(__dirname, '../public')
const appDir = path.join(__dirname, '../src/app')

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo.png...\n')

    // Check if input file exists
    if (!fs.existsSync(inputLogo)) {
      console.error('Error: logo.png not found in public directory')
      return
    }

    const image = sharp(inputLogo)

    // Generate favicon.ico (16x16, 32x32, 48x48)
    console.log('📱 Generating favicon.ico...')
    await image
      .resize(48, 48)
      .png()
      .toFile(path.join(publicDir, 'favicon-48.png'))

    await image
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32.png'))

    await image
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16.png'))

    // Generate Apple Touch Icon
    console.log('🍎 Generating apple-touch-icon...')
    await image
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'))

    // Generate Android icons
    console.log('🤖 Generating Android icons...')
    await image
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'))

    await image
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'))

    // Generate Next.js app icon
    console.log('⚡ Generating Next.js app icon...')
    await image.resize(32, 32).png().toFile(path.join(appDir, 'icon.png'))

    // Generate manifest icons
    console.log('📋 Generating manifest icons...')
    const manifestSizes = [72, 96, 128, 144, 152, 384]
    for (const size of manifestSizes) {
      await image
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`))
    }

    console.log('\n✅ All favicons generated successfully!')
    console.log('\nGenerated files:')
    console.log('- favicon-16.png, favicon-32.png, favicon-48.png')
    console.log('- apple-touch-icon.png')
    console.log('- android-chrome-192x192.png, android-chrome-512x512.png')
    console.log('- src/app/icon.png (Next.js app icon)')
    console.log('- Various manifest icons (72x72 to 384x384)')
  } catch (error) {
    console.error('Error generating favicons:', error.message)
  }
}

generateFavicons()
