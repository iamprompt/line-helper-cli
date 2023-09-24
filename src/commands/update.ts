import { getCredentials } from '@/prompts/getCredentials'
import { updateLIFFEndpointPrompt } from '@/prompts/updateLIFFEndpoint'
import { loadConfig } from '@/utils/config'
import { getLIFFApp } from '@/utils/line'
import { logger } from '@/utils/logger'
import { Command } from 'commander'

const update = async () => {
  await getCredentials()

  const { liffId } = await loadConfig()

  if (!liffId) {
    logger.error('LIFF ID is not found. Please run `liff-helper init` first.')
    return
  }

  const app = await getLIFFApp(liffId)

  if (!app) {
    logger.error('LIFF App is not found.')
    return
  }

  await updateLIFFEndpointPrompt(app)

  logger.break()

  logger.success(`Successfully updated LIFF App Endpoint.`)
}

export const updateCommand = new Command()
  .name('update')
  .description('Update LIFF App Endpoint')
  .action(update)
