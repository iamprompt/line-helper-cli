import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import { getNgrokUrls } from '@/services/ngrok'
import { logger } from '@/utils/logger'
import { parseOptions } from '@/utils/options'
import { prompt } from '@/utils/prompts'
import axios from 'axios'
import { z } from 'zod'

type TunnelUrlPrompt = { tunnel: string }

export const URLEndpointNgrokPrompt = async () => {
  try {
    const tunnels = await getNgrokUrls()

    if (!tunnels || tunnels.length === 0) {
      throw new Error('ngrok tunnel is not found.')
    }

    const { tunnel }: TunnelUrlPrompt = await prompt([
      {
        type: 'select',
        name: 'tunnel',
        message: 'Select ngrok tunnel url',
        choices: parseOptions(tunnels),
      },
    ])

    return tunnel
  } catch (error) {
    throw error
  }
}
