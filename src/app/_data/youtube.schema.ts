import { z } from 'zod'

import json from './youtube.json'

const YouTubeVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
})

const YouTubeDataSchema = z.object({
  movies: z.array(YouTubeVideoSchema),
})

export type YouTubeVideo = z.infer<typeof YouTubeVideoSchema>
export type YouTubeData = z.infer<typeof YouTubeDataSchema>

export function validateYouTubeData(data: unknown): YouTubeData {
  return YouTubeDataSchema.parse(data)
}

export function safeParseYouTubeData(
  data: unknown
):
  | { success: true; data: YouTubeData }
  | { success: false; error: z.ZodError } {
  const result = YouTubeDataSchema.safeParse(data)
  return result
}

export const youtube = validateYouTubeData(json)
