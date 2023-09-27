import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'

type TunnelUrlPrompt = { endpoint: string }

export const URLEndpointCustomPrompt = async () => {
  const { endpoint }: TunnelUrlPrompt = await prompt([
    {
      type: 'text',
      name: 'endpoint',
      message: 'Input LIFF Endpoint URL',
      validate: validateUrl,
    },
  ])

  return endpoint
}
