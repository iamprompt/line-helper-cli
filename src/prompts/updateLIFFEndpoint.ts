import { LIFFApp } from '@/models/liff'
import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import { updateLIFFApp } from '@/utils/line'
import { logger } from '@/utils/logger'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import axios from 'axios'
import { z } from 'zod'
import { liffEndpointPrompt } from './liffEndpointPrompt'

export const updateLIFFEndpointPrompt = async (liff: LIFFApp) => {
  const { needToUpdate } = await prompt([
    {
      type: 'confirm',
      name: 'needToUpdate',
      message:
        'Do you want to update LIFF Endpoint? (current: ' + liff.view.url + ')',
      initial: true,
    },
  ])

  if (!needToUpdate) {
    return liff
  }

  const endpoint = await liffEndpointPrompt()

  if (!endpoint) {
    logger.error('LIFF Endpoint is not found.')
    process.exit(1)
  }

  return await updateLIFFApp(liff.liffId!, {
    view: {
      url: endpoint,
    },
  })
}
