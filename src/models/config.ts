import { z } from 'zod'

export const configSchema = z.object({
  liffId: z.string().optional(),
  channelId: z.string().optional(),
  channelSecret: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>
