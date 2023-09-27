import { getCredentials } from '@/prompts/getCredentials'
import { saveConfig } from '@/utils/config'
import {
  findLIFFAppByLIFFId,
  getLIFFApps,
  getWebhookEndpoint,
} from '@/services/line'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { UpdateEndpointPrompt } from '@/prompts/UpdateEndpoint'
import { LIFFAppPrompt } from '@/prompts/LIFFApp'

const bindLIFFApp = async () => {
  const apps = await getLIFFApps()
  const selectedLIFFAppId = await LIFFAppPrompt(apps)
  const existingLIFFApp = findLIFFAppByLIFFId(selectedLIFFAppId, apps)

  if (existingLIFFApp) {
    await UpdateEndpointPrompt({
      type: 'liff',
      id: selectedLIFFAppId,
      currentEndpoint: existingLIFFApp.view.url,
    })
  }

  saveConfig({ scope: 'liff', liffId: selectedLIFFAppId })

  logger.break()
  logger.info(`Run \`line-helper update\` to update LIFF App Endpoint.`)
  logger.info(`Run \`line-helper init\` to change LIFF App.`)
}

const bindMessagingAPI = async () => {
  const { endpoint } = await getWebhookEndpoint()
  const result: string = await UpdateEndpointPrompt({
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
