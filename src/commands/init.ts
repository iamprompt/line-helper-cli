import { Command } from 'commander'

import { getCredentials } from '@/prompts/getCredentials'
import { LIFFAppPrompt } from '@/prompts/LIFFApp'
import { UpdateEndpointPrompt } from '@/prompts/UpdateEndpoint'
import {
  findLIFFAppByLIFFId,
  getLIFFApps,
  getWebhookEndpoint,
} from '@/services/line'
import { saveConfig } from '@/utils/config'
import { logger } from '@/utils/logger'

const bindLIFFApp = async () => {
  const apps = await getLIFFApps()
  const selectedLIFFAppId = await LIFFAppPrompt(apps)
  const existingLIFFApp = findLIFFAppByLIFFId(selectedLIFFAppId, apps)

  if (!existingLIFFApp) {
    logger.error('LIFF App is not found.')
    process.exit(1)
  }

  await UpdateEndpointPrompt({
    type: 'liff',
    id: selectedLIFFAppId,
    currentEndpoint: existingLIFFApp.view.url,
  })

  saveConfig({ scope: 'liff', liffId: selectedLIFFAppId })

  logger.break()
  logger.info(`Run \`line-helper update\` to update LIFF App Endpoint.`)
  logger.info(`Run \`line-helper init\` to change LIFF App.`)
}

const bindMessagingAPI = async () => {
  const { endpoint } = await getWebhookEndpoint()
  await UpdateEndpointPrompt({
    id: '',
    type: 'messaging-api',
    currentEndpoint: endpoint,
  })

  saveConfig({ scope: 'messaging-api' })

  logger.break()
  logger.info(`Run \`line-helper update\` to update Messaging API Endpoint.`)
  logger.info(`Run \`line-helper init\` to change Messaging API.`)
}

const init = async () => {
  const { scope } = await getCredentials()

  switch (scope) {
    case 'liff':
      await bindLIFFApp()
      break
    case 'messaging-api':
      await bindMessagingAPI()
      break
  }
}

export const initCommand = new Command()
  .name('init')
  .description('Bind LIFF App or Messaging API to this project')
  .action(init)
