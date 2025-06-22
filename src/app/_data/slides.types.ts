// Auto-generated types for slide data
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
