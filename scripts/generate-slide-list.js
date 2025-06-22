const fs = require('fs')
const path = require('path')

const slideDir = path.join(__dirname, '../public/slide')
const outputPath = path.join(__dirname, '../src/app/_data/slides.json')

function generateSlideList() {
  try {
    console.log('Generating slide list from /public/slide...\n')

    // Check if slide directory exists
    if (!fs.existsSync(slideDir)) {
      console.error('Error: /public/slide directory not found')
      return
    }

    // Read all files in slide directory
    const files = fs.readdirSync(slideDir)

    // Filter for image files and sort
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return (
          ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext) &&
          !file.includes('Zone.Identifier')
        )
      })
      .sort() // Sort alphabetically

    if (imageFiles.length === 0) {
      console.warn('Warning: No image files found in /public/slide')
      return
    }

    // Group files by basename (filename without extension)
    const fileGroups = new Map()

    imageFiles.forEach(filename => {
      const basename = path.parse(filename).name
      const ext = path.extname(filename).toLowerCase()
      const filePath = path.join(slideDir, filename)
      const stats = fs.statSync(filePath)

      if (!fileGroups.has(basename)) {
        fileGroups.set(basename, {
          basename: basename,
          files: [],
        })
      }

      fileGroups.get(basename).files.push({
        filename: filename,
        path: `/slide/${filename}`,
        format: ext.replace('.', ''),
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
      })
    })

    // Generate slide data with multiple format support
    const slides = Array.from(fileGroups.values()).map((group, index) => {
      // Sort files by preference: webp > png > jpg > jpeg > gif
      const formatPriority = { webp: 0, png: 1, jpg: 2, jpeg: 3, gif: 4 }
      group.files.sort(
        (a, b) =>
          (formatPriority[a.format] || 999) - (formatPriority[b.format] || 999)
      )

      const primaryFile = group.files[0]
      const alternativeFormats = group.files.slice(1)

      return {
        id: index + 1,
        basename: group.basename,
        filename: primaryFile.filename,
        path: primaryFile.path,
        alt: `SAVAGEイベントのスライド ${index + 1}`,
        format: primaryFile.format,
        size: primaryFile.size,
        createdAt: primaryFile.createdAt,
        modifiedAt: primaryFile.modifiedAt,
        alternatives: alternativeFormats,
      }
    })

    // Create JSON output
    const slideData = {
      metadata: {
        total: slides.length,
        generatedAt: new Date().toISOString(),
        directory: '/public/slide',
        formats: [...new Set(slides.map(s => s.format))].sort(),
      },
      slides: slides,
    }

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(slideData, null, 2), 'utf8')

    console.log(`✅ Slide list generated successfully!`)
    console.log(`📁 Found ${slides.length} unique slides`)
    console.log(`📄 Output: ${path.relative(process.cwd(), outputPath)}`)
    console.log(`📊 Formats: ${slideData.metadata.formats.join(', ')}`)

    // Show file list
    console.log('\n📋 Slide groups:')
    slides.forEach(slide => {
      const sizeKB = Math.round(slide.size / 1024)
      const altCount = slide.alternatives.length
      const altFormats = slide.alternatives.map(alt => alt.format).join(', ')
      const altInfo = altCount > 0 ? ` (+${altCount} alt: ${altFormats})` : ''
      console.log(
        `  ${slide.id.toString().padStart(2, '0')}. ${slide.basename} [${slide.format.toUpperCase()}] (${sizeKB}KB)${altInfo}`
      )
    })

    // Generate TypeScript types
    const typesContent = `// Auto-generated types for slide data
export interface SlideMetadata {
  total: number
  generatedAt: string
  directory: string
  formats: string[]
}

export interface SlideFile {
  filename: string
  path: string
  format: string
  size: number
  createdAt: string
  modifiedAt: string
}

export interface Slide {
  id: number
  basename: string
  filename: string
  path: string
  alt: string
  format: string
  size: number
  createdAt: string
  modifiedAt: string
  alternatives: SlideFile[]
}

export interface SlideData {
  metadata: SlideMetadata
  slides: Slide[]
}
`

    const typesPath = path.join(__dirname, '../src/app/_data/slides.types.ts')
    fs.writeFileSync(typesPath, typesContent, 'utf8')
    console.log(
      `\n🔷 TypeScript types: ${path.relative(process.cwd(), typesPath)}`
    )
  } catch (error) {
    console.error('Error generating slide list:', error.message)
  }
}

generateSlideList()
