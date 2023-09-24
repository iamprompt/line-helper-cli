import { getCredentials } from '@/prompts/getCredentials'
import { selectLIFFApp } from '@/prompts/selectLIFFApp'
import { updateLIFFEndpointPrompt } from '@/prompts/updateLIFFEndpoint'
import { saveConfig } from '@/utils/config'
import { findLIFFAppByLIFFId, getLIFFApps } from '@/utils/line'
import { logger } from '@/utils/logger'
import { Command } from 'commander'

const init = async () => {
  await getCredentials()

  const apps = await getLIFFApps()

  const selectedLIFFAppId = await selectLIFFApp(apps)
  const existingLIFFApp = findLIFFAppByLIFFId(selectedLIFFAppId, apps)

  if (existingLIFFApp) {
    await updateLIFFEndpointPrompt(existingLIFFApp)
  }

  saveConfig({ liffId: selectedLIFFAppId })

  logger.break()

  logger.info(`LIFF App for this project is ${selectedLIFFAppId}.`)

  logger.break()

  logger.info(`Run \`liff-helper update\` to update LIFF App Endpoint.`)
  logger.info(`Run \`liff-helper init\` to change LIFF App.`)
}

export const initCommand = new Command()
  .name('init')
  .description('Initialize LIFF App')
  .action(init)
