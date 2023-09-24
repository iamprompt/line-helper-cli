import { NgrokTunnelsAPIResponseSchema } from '@/models/ngrok'
import { logger } from '@/utils/logger'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import axios from 'axios'
import { z } from 'zod'

const tunnelServices = {
  ngrok: 'ngrok',
}

export const liffEndpointPrompt = async () => {
  const { tunnelService } = await prompt([
    {
      type: 'select',
      name: 'tunnelService',
      message: 'Select tunnel service or input custom URL',
      choices: [
        ...Object.entries(tunnelServices).map(([key, value]) => ({
          title: value,
          value: key,
        })),
        { title: 'Custom URL', value: 'custom' },
      ],
    },
  ])

  let endpoint = ''

  if (tunnelService === 'ngrok') {
    try {
      const tunnels = await axios.get<
        z.infer<typeof NgrokTunnelsAPIResponseSchema>
      >('http://localhost:4040/api/tunnels')

      const { tunnel } = await prompt([
        {
          type: 'select',
          name: 'tunnel',
          message: 'Select ngrok tunnel',
          choices: tunnels.data.tunnels.map((tunnel) => ({
            title: tunnel.public_url,
            value: tunnel.public_url,
          })),
        },
      ])

      endpoint = tunnel
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          logger.error('ngrok is not running, please run `ngrok http {port}`')
          process.exit(1)
        } else {
          logger.error('there is an error while connecting to ngrok')
        }
      }
    }
  }

  if (tunnelService === 'custom' || endpoint === '') {
    const { endpoint: endpointCustom } = await prompt([
      {
        type: 'text',
        name: 'endpoint',
        message: 'Input LIFF Endpoint URL',
        validate: validateUrl,
      },
    ])

    endpoint = endpointCustom
  }

  return endpoint
}
