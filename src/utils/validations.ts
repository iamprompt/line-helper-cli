import { z } from 'zod'

const urlSchema = z.string().url({ message: 'Invalid URL' })
export const validateUrl = (url: string) => {
  const parseResult = urlSchema.safeParse(url)
  if (!parseResult.success) {
    return parseResult.error.issues[0].message
  }

  if (!url.startsWith('https://')) {
    return 'URL must be HTTPS'
  }

  return true
}
