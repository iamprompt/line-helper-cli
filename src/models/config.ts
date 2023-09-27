import { z } from 'zod'

export const configSchema = z.object({
  scope: z.string().optional(),
  liffId: z.string().optional(),
  channelId: z.string().optional(),
  channelSecret: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>
