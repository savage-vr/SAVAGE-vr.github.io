// Fonts and images for the build-time OG images (next/og needs TTF, not woff2).
// IBM Plex is licensed under the SIL Open Font License, see OFL.txt.
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }

const root = process.cwd()

export const loadFonts = async () => [
  {
    name: 'IBM Plex Serif',
    data: await readFile(join(root, 'src/app/_og/IBMPlexSerif-Medium.ttf')),
    weight: 500 as const,
    style: 'normal' as const,
  },
  {
    name: 'IBM Plex Mono',
    data: await readFile(join(root, 'src/app/_og/IBMPlexMono-Regular.ttf')),
    weight: 400 as const,
    style: 'normal' as const,
  },
]

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

// A file under /public as a data URL, plus its pixel size
export const publicImage = async (path: string) => {
  const data = await readFile(join(root, 'public', path))
  const { default: sharp } = await import('sharp')
  const { width = 1, height = 1 } = await sharp(data).metadata()
  const mime = MIME[extname(path).toLowerCase()] ?? 'image/png'
  return {
    src: `data:${mime};base64,${data.toString('base64')}`,
    width,
    height,
  }
}

export const colors = {
  bg: '#000',
  fg: '#f2f2f3',
  muted: '#a1a1a8',
  border: '#ffffff29',
}
