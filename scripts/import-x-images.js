const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const sharp = require('sharp')

const slideDir = path.join(__dirname, '../public/slide')
const sourcesPath = path.join(
  __dirname,
  '../src/app/_data/gallery-sources.json'
)

const usage = `Usage:
  node scripts/import-x-images.js preview <candidates.json>
  node scripts/import-x-images.js import <candidates.json> --pick 1,3,5 [--keep-rest]
  node scripts/import-x-images.js remove <tweetId|basename>...

candidates.json: [{ tweetId, url, author, postedAt, images: [imageUrl] }]`

function loadSources() {
  if (!fs.existsSync(sourcesPath)) return { imported: {}, skipped: [] }
  return JSON.parse(fs.readFileSync(sourcesPath, 'utf8'))
}

function saveSources(sources) {
  fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + '\n', 'utf8')
}

function knownTweetIds(sources) {
  const ids = new Set(sources.skipped)
  Object.values(sources.imported).forEach(entry => ids.add(entry.tweetId))
  return ids
}

// pbs.twimg.com/media/<id>?format=jpg&name=small -> original size
function toOriginalUrl(imageUrl) {
  const url = new URL(imageUrl)
  const format = url.searchParams.get('format') || 'jpg'
  return `${url.origin}${url.pathname}?format=${format}&name=orig`
}

// Flatten candidates into numbered images, dropping tweets already handled
function listNewImages(candidatesPath) {
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'))
  const known = knownTweetIds(loadSources())
  const seen = new Set()
  const images = []

  candidates.forEach(tweet => {
    if (known.has(tweet.tweetId) || seen.has(tweet.tweetId)) return
    seen.add(tweet.tweetId)
    tweet.images
      .filter(src => src.includes('pbs.twimg.com/media/'))
      .forEach((src, index) => {
        images.push({
          number: images.length + 1,
          basename: `x_${tweet.tweetId}_${index + 1}`,
          imageUrl: toOriginalUrl(src),
          tweet,
        })
      })
  })

  return images
}

function escapeHtml(text) {
  return String(text).replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  )
}

function preview(candidatesPath) {
  const images = listNewImages(candidatesPath)
  if (images.length === 0) {
    console.log('No new images.')
    return
  }

  const cards = images
    .map(
      image => `<figure>
  <a href="${escapeHtml(image.tweet.url)}" target="_blank"><img src="${escapeHtml(image.imageUrl.replace('name=orig', 'name=medium'))}" loading="lazy"></a>
  <figcaption><b>#${image.number}</b> ${escapeHtml(image.tweet.author)} · ${escapeHtml(image.tweet.postedAt?.slice(0, 10) ?? '')}</figcaption>
</figure>`
    )
    .join('\n')

  const htmlPath = candidatesPath.replace(/\.json$/, '') + '.html'
  fs.writeFileSync(
    htmlPath,
    `<!doctype html><meta charset="utf-8"><title>Gallery candidates</title>
<style>
body{margin:0;padding:24px;background:#0a0a0a;color:#eee;font:14px system-ui}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
figure{margin:0}img{width:100%;aspect-ratio:16/9;object-fit:cover;background:#222}
b{font-size:18px;margin-right:6px}
</style>
<h1>#SAVAGE_vr — ${images.length} new images</h1>
<main>
${cards}
</main>`,
    'utf8'
  )

  images.forEach(image =>
    console.log(
      `#${String(image.number).padStart(2)}  ${image.tweet.author}  ${image.tweet.url}`
    )
  )
  console.log(`\nPreview: ${htmlPath}`)
}

function parsePick(args) {
  const index = args.indexOf('--pick')
  if (index === -1 || !args[index + 1]) throw new Error('--pick is required')
  return new Set(args[index + 1].split(',').map(n => Number(n.trim())))
}

async function download(image) {
  const response = await fetch(image.imageUrl)
  if (!response.ok) {
    throw new Error(`${response.status} ${image.imageUrl}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const pipeline = sharp(buffer).resize(2560, 2560, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  await pipeline
    .clone()
    .jpeg({ quality: 90, progressive: true })
    .toFile(path.join(slideDir, `${image.basename}.jpg`))
  await pipeline
    .clone()
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(slideDir, `${image.basename}.webp`))
}

function regenerateSlideList() {
  execFileSync('node', [path.join(__dirname, 'generate-slide-list.js')], {
    stdio: 'inherit',
  })
}

async function importImages(candidatesPath, args) {
  const picked = parsePick(args)
  const keepRest = args.includes('--keep-rest')
  const images = listNewImages(candidatesPath)
  const sources = loadSources()
  const pickedTweets = new Set()

  for (const image of images.filter(image => picked.has(image.number))) {
    await download(image)
    sources.imported[image.basename] = {
      tweetId: image.tweet.tweetId,
      author: image.tweet.author,
      url: image.tweet.url,
      postedAt: image.tweet.postedAt,
    }
    pickedTweets.add(image.tweet.tweetId)
    console.log(`✓ ${image.basename} (${image.tweet.author})`)
  }

  // Remember rejected tweets so the next crawl doesn't propose them again
  if (!keepRest) {
    new Set(images.map(image => image.tweet.tweetId)).forEach(id => {
      if (!pickedTweets.has(id) && !sources.skipped.includes(id)) {
        sources.skipped.push(id)
      }
    })
  }

  saveSources(sources)
  regenerateSlideList()
}

function remove(targets) {
  const sources = loadSources()
  Object.entries(sources.imported)
    .filter(([basename, entry]) =>
      targets.some(target => target === basename || target === entry.tweetId)
    )
    .forEach(([basename, entry]) => {
      ;['jpg', 'webp'].forEach(ext => {
        const file = path.join(slideDir, `${basename}.${ext}`)
        if (fs.existsSync(file)) fs.unlinkSync(file)
      })
      delete sources.imported[basename]
      if (!sources.skipped.includes(entry.tweetId)) {
        sources.skipped.push(entry.tweetId)
      }
      console.log(`✗ ${basename}`)
    })
  saveSources(sources)
  regenerateSlideList()
}

async function main() {
  const [command, ...args] = process.argv.slice(2)
  if (command === 'preview' && args[0]) return preview(args[0])
  if (command === 'import' && args[0]) return importImages(args[0], args)
  if (command === 'remove' && args.length > 0) return remove(args)
  console.log(usage)
  process.exitCode = 1
}

main().catch(error => {
  console.error('Error:', error.message)
  process.exitCode = 1
})
