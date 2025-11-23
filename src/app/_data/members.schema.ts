import { z } from 'zod'

import json from './members.json'

const MemberSchema = z.object({
  name: z.string(),
  imgSrc: z.string(),
  roles: z.array(z.enum(['BOSS', 'DJ', 'VJ'])),
  links: z.array(z.tuple([z.string(), z.string().url()])),
})

const MembersDataSchema = z.object({
  members: z.array(MemberSchema),
})

export type Member = z.infer<typeof MemberSchema>
export type MembersData = z.infer<typeof MembersDataSchema>

export function validateMembersData(data: unknown): MembersData {
  return MembersDataSchema.parse(data)
}

export function safeParseMembersData(
  data: unknown
):
  | { success: true; data: MembersData }
  | { success: false; error: z.ZodError } {
  const result = MembersDataSchema.safeParse(data)
  return result
}

export const members = validateMembersData(json)
