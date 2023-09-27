import { TUNNEL_SERVICE_OPTIONS } from '@/const/options'
import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import { logger } from '@/utils/logger'
import { parseOptions } from '@/utils/options'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import axios from 'axios'
import { ValueOf } from 'type-fest'
import { z } from 'zod'
import { URLEndpointNgrokPrompt } from './URLEndpointNgrok'
import { URLEndpointCustomPrompt } from './URLEndpointCustom'

type TunnelServicePrompt = {
  tunnelService: keyof typeof TUNNEL_SERVICE_OPTIONS
}

export const URLEndpointPrompt = async () => {
  const { tunnelService }: TunnelServicePrompt = await prompt([
    {
      type: 'select',
      name: 'tunnelService',
      message: 'Select tunnel service or input custom URL',
      choices: parseOptions(TUNNEL_SERVICE_OPTIONS),
    },
  ])

  let endpoint: string = ''

  switch (tunnelService) {
    case 'ngrok':
      if (!endpoint) {
        endpoint = await URLEndpointNgrokPrompt()
      }
    case 'custom':
      if (!endpoint) {
        endpoint = await URLEndpointCustomPrompt()
      }
  }

  if (!endpoint || endpoint === '') {
    throw new Error('LIFF Endpoint is not found.')
  }

  return endpoint
}
