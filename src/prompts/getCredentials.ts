import { getBotInfo, getLINEAccessToken } from '@/services/line'
import { loadConfig, saveConfig } from '@/utils/config'
import { debug, logger } from '@/utils/logger'
import { prompt } from '@/utils/prompts'

let scope: 'liff' | 'messaging-api' | null = null
let accessToken: string | null = null

export const getCredentials = async () => {
  if (accessToken) {
    return {
      scope,
      accessToken,
    }
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
      debug.info('Access Token:', accessToken)

      const botInfo = await getBotInfo()
      const isMessagingAPI = !!botInfo?.userId

      scope = isMessagingAPI ? 'messaging-api' : 'liff'

      debug.info(`Scope: ${scope}`)

      saveConfig({ channelId, channelSecret, scope })

      return {
        scope,
        accessToken,
      }
    } catch (error) {
      logger.error('Invalid credentials, please try again.')
    }
  }
}
