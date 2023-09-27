import { Command } from 'commander'

import { getCredentials } from '@/prompts/getCredentials'
import { LIFFAppPrompt } from '@/prompts/LIFFApp'
import { UpdateEndpointPrompt } from '@/prompts/UpdateEndpoint'
import { getLIFFApp, getLIFFApps, getWebhookEndpoint } from '@/services/line'
import { loadConfig, saveConfig } from '@/utils/config'
import { logger } from '@/utils/logger'
import { getOptions } from '@/utils/program'

const updateLIFF = async () => {
  let { liffId } = await loadConfig()

  let isNewlyCreate = false

  const { changeLiff } = await getOptions()

  if (changeLiff) {
    liffId = undefined
    saveConfig({ scope: 'liff', liffId: undefined })
  }

  if (!liffId) {
    const apps = await getLIFFApps()
    const [selectedLIFFApp, isNew] = await LIFFAppPrompt(apps)
    liffId = selectedLIFFApp
    isNewlyCreate = isNew
  }

  const app = await getLIFFApp(liffId)

  if (!app) {
    logger.error('LIFF App is not found.')
    process.exit(1)
  }

  if (!isNewlyCreate) {
    await UpdateEndpointPrompt({
      type: 'liff',
      id: liffId,
      currentEndpoint: app.view.url,
    })
  } else {
    logger.break()
    logger.info('LIFF App is successfully created with id:', liffId)
  }
}

const updateMessagingAPI = async () => {
  const { endpoint } = await getWebhookEndpoint()
  await UpdateEndpointPrompt({
    id: '',
    type: 'messaging-api',
    currentEndpoint: endpoint,
  })

  saveConfig({ scope: 'messaging-api' })
}

const update = async () => {
  const { scope } = await getCredentials()
  switch (scope) {
    case 'liff':
      return await updateLIFF()
    case 'messaging-api':
      return await updateMessagingAPI()
  }
}

export const updateCommand = new Command()
  .name('update')
  .description('Update LIFF App Endpoint URL or Messaging API Webhook URL')
  .action(update)
