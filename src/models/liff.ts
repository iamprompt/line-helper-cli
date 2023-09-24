import { z } from 'zod'

export const LIFFAppSchema = z.object({
  liffId: z.string().optional(),
  view: z.object({
    url: z.string().url(),
    type: z.enum(['full', 'tall', 'compact']).default('full'),
    moduleMode: z.boolean().optional().default(false),
  }),
  description: z.string().optional().default(''),
  features: z
    .object({
      ble: z.boolean().optional().default(false),
      qrCode: z.boolean().optional().default(false),
    })
    .optional(),
  permanentLinkPattern: z.enum(['concat']).optional().default('concat'),
  scope: z
    .array(z.enum(['openid', 'email', 'profile', 'chat_message.write']))
    .optional()
    .default(['profile', 'chat_message.write']),
  botPrompt: z
    .enum(['normal', 'aggressive', 'none'])
    .optional()
    .default('none'),
})
export type LIFFApp = z.infer<typeof LIFFAppSchema>
