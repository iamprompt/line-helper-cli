import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import { getNgrokUrls } from '@/services/ngrok'
import { logger } from '@/utils/logger'
import { parseOptions } from '@/utils/options'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import axios from 'axios'
import { z } from 'zod'

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
