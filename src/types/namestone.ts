import { z } from 'zod'

export const NamestoneProfileSchema = z.object({
  name: z.string(),
  address: z.string(),
  domain: z.string(),
  text_records: z.record(z.string(), z.string()).optional(),
  coin_types: z.record(z.string(), z.string()).optional(),
})

export type NamestoneProfile = z.infer<typeof NamestoneProfileSchema>
