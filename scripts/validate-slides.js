const fs = require('fs')
const path = require('path')

const slidesPath = path.join(__dirname, '../src/app/_data/slides.json')

function validateSlidesData() {
  try {
    console.log('Validating slides data...\n')

    // Check if file exists
    if (!fs.existsSync(slidesPath)) {
      console.error('❌ slides.json not found')
      console.log('Run `npm run generate-slides` to create it')
      return false
    }

    // Read and parse JSON
    const rawData = fs.readFileSync(slidesPath, 'utf8')
    let data
    try {
      data = JSON.parse(rawData)
    } catch (parseError) {
      console.error('❌ Invalid JSON format:', parseError.message)
      return false
    }

    // Basic structure validation
    const errors = []

    if (!data.metadata) {
      errors.push('Missing metadata object')
    } else {
      if (typeof data.metadata.total !== 'number') {
        errors.push('metadata.total must be a number')
      }
      if (!data.metadata.generatedAt) {
        errors.push('metadata.generatedAt is required')
      }
      if (!Array.isArray(data.metadata.formats)) {
        errors.push('metadata.formats must be an array')
      }
    }

    if (!Array.isArray(data.slides)) {
      errors.push('slides must be an array')
    } else {
      // Validate each slide
      data.slides.forEach((slide, index) => {
        const slideErrors = []

        if (typeof slide.id !== 'number')
          slideErrors.push('id must be a number')
        if (!slide.filename) slideErrors.push('filename is required')
        if (!slide.path || !slide.path.startsWith('/slide/')) {
          slideErrors.push('path must start with /slide/')
        }
        if (!slide.alt) slideErrors.push('alt text is required')
        if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(slide.format)) {
          slideErrors.push('format must be png, jpg, jpeg, webp, or gif')
        }
        if (typeof slide.size !== 'number' || slide.size <= 0) {
          slideErrors.push('size must be a positive number')
        }

        if (slideErrors.length > 0) {
          errors.push(`Slide ${index + 1}: ${slideErrors.join(', ')}`)
        }
      })

      // Cross-validation
      if (data.metadata && data.metadata.total !== data.slides.length) {
        errors.push(
          `Metadata total (${data.metadata.total}) doesn't match slides length (${data.slides.length})`
        )
      }

      // Check for duplicate IDs
      const ids = data.slides.map(s => s.id)
      const uniqueIds = new Set(ids)
      if (ids.length !== uniqueIds.size) {
        errors.push('Duplicate slide IDs found')
      }

      // Check formats consistency
      if (data.metadata && data.metadata.formats) {
        const actualFormats = [
          ...new Set(data.slides.map(s => s.format)),
        ].sort()
        const metadataFormats = data.metadata.formats.sort()
        if (JSON.stringify(actualFormats) !== JSON.stringify(metadataFormats)) {
          errors.push("Metadata formats don't match actual slide formats")
        }
      }

      // Check file existence
      const slideDir = path.join(__dirname, '../public/slide')
      const missingFiles = []
      data.slides.forEach(slide => {
        const filePath = path.join(slideDir, slide.filename)
        if (!fs.existsSync(filePath)) {
          missingFiles.push(slide.filename)
        }
      })
      if (missingFiles.length > 0) {
        errors.push(`Missing files: ${missingFiles.join(', ')}`)
      }
    }

    if (errors.length > 0) {
      console.error('❌ Validation failed:')
      errors.forEach(error => console.error(`  • ${error}`))
      return false
    }

    // Success report
    console.log('✅ Validation successful!')
    console.log(`📊 Summary:`)
    console.log(`  • Total slides: ${data.slides.length}`)
    console.log(`  • Formats: ${data.metadata.formats.join(', ')}`)
    console.log(
      `  • Generated: ${new Date(data.metadata.generatedAt).toLocaleString()}`
    )

    // File size summary
    const totalSize = data.slides.reduce((sum, slide) => sum + slide.size, 0)
    const avgSize = Math.round(totalSize / data.slides.length / 1024)
    console.log(`  • Total size: ${Math.round(totalSize / 1024 / 1024)}MB`)
    console.log(`  • Average size: ${avgSize}KB`)

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

const isValid = validateSlidesData()
process.exit(isValid ? 0 : 1)
