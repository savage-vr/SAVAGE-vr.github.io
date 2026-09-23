import { z } from 'zod'

import slidesData from './slides.json'

const SlideMetadataSchema = z.object({
  total: z.number().positive(),
  generatedAt: z.string().datetime(),
  directory: z.string(),
  formats: z.array(z.string()).min(1),
})

const SlideFileSchema = z.object({
  filename: z.string().min(1),
  path: z.string().startsWith('/slide/'),
  format: z.enum(['png', 'jpg', 'jpeg', 'webp', 'gif']),
  size: z.number().positive(),
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
})

const SlideCreditSchema = z.object({
  author: z.string().min(1),
  url: z.string().url(),
})

const SlideSchema = z.object({
  id: z.number().positive(),
  basename: z.string().min(1),
  filename: z.string().min(1),
  path: z.string().startsWith('/slide/'),
  alt: z.string().min(1),
  format: z.enum(['png', 'jpg', 'jpeg', 'webp', 'gif']),
  size: z.number().positive(),
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
  alternatives: z.array(SlideFileSchema),
  credit: SlideCreditSchema.optional(),
  // CSS object-position for images that don't fit 16:9
  position: z.string().optional(),
})

const SlidesDataSchema = z
  .object({
    metadata: SlideMetadataSchema,
    slides: z.array(SlideSchema).min(1),
  })
  .refine(data => data.metadata.total === data.slides.length, {
    message: 'Metadata total must match slides array length',
    path: ['metadata', 'total'],
  })

export type SlideMetadata = z.infer<typeof SlideMetadataSchema>
export type SlideFile = z.infer<typeof SlideFileSchema>
export type SlideCredit = z.infer<typeof SlideCreditSchema>
export type Slide = z.infer<typeof SlideSchema>
export type SlidesData = z.infer<typeof SlidesDataSchema>

export function validateSlidesData(data: unknown): SlidesData {
  return SlidesDataSchema.parse(data)
}

export function safeParseSlidesData(
  data: unknown
): { success: true; data: SlidesData } | { success: false; error: z.ZodError } {
  const result = SlidesDataSchema.safeParse(data)
  return result
}

// Validate imported data
export const slides = validateSlidesData(slidesData)
