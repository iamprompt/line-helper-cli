import { getCredentials } from '@/prompts/getCredentials'
import { loadConfig } from '@/utils/config'
import { getLIFFApp, getLIFFApps, getWebhookEndpoint } from '@/services/line'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { LINEScopePrompt } from '@/prompts/LINEScope'
import { UpdateEndpointPrompt } from '@/prompts/UpdateEndpoint'
import { LIFFAppPrompt } from '@/prompts/LIFFApp'

const updateLIFF = async () => {
  let { liffId } = await loadConfig()

  if (!liffId) {
    const apps = await getLIFFApps()
    const selectedLIFFApp = await LIFFAppPrompt(apps, false)
    liffId = selectedLIFFApp
  }

  const app = await getLIFFApp(liffId)

  if (!app) {
    logger.error('LIFF App is not found.')
    process.exit(1)
  }

  await UpdateEndpointPrompt({
    type: 'liff',
    id: liffId,
    currentEndpoint: app.view.url,
  })
}

const updateMessagingAPI = async () => {
  const { endpoint } = await getWebhookEndpoint()
  await UpdateEndpointPrompt({
    id: '',
    type: 'messaging-api',
    currentEndpoint: endpoint,
  })
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
