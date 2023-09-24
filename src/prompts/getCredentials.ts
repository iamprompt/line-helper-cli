import { getLINEAccessToken } from '@/utils/line'
import { loadConfig, saveConfig } from '@/utils/config'
import { logger } from '@/utils/logger'
import { prompt } from '@/utils/prompts'

let accessToken: string | null = null

export const getCredentials = async () => {
  if (accessToken) {
    return accessToken
  }

  while (true) {
    const { channelId: configChannelId, channelSecret: configChannelSecret } =
      await loadConfig()

    const { channelId = configChannelId, channelSecret = configChannelSecret } =
      await prompt([
        {
          type: configChannelId ? null : 'text',
          name: 'channelId',
          message: 'Input Channel ID',
        },
        {
          type: configChannelSecret ? null : 'password',
          name: 'channelSecret',
          message: 'Input Channel Secret',
        },
      ])

    try {
      const accessToken = await getLINEAccessToken(channelId, channelSecret)
      logger.success('Successfully authenticated.')

      saveConfig({ channelId, channelSecret })

      return accessToken
    } catch (error) {
      logger.error('Invalid credentials, please try again.')
    }
  }
}
