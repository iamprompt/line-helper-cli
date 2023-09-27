import { LINE_SCOPE_OPTIONS } from '@/const/options'
import { setWebhookEndpoint, updateLIFFApp } from '@/services/line'
import { saveConfig } from '@/utils/config'
import { logger } from '@/utils/logger'
import { prompt } from '@/utils/prompts'

import { URLEndpointPrompt } from './URLEndpoint'

type UpdateEndpointPromptParams = {
  type: keyof typeof LINE_SCOPE_OPTIONS
  id: string
  currentEndpoint?: string
}

type NeedToUpdatePrompt = { needToUpdate: boolean }

export const UpdateEndpointPrompt = async ({
  type,
  id,
  currentEndpoint,
}: UpdateEndpointPromptParams) => {
  const { needToUpdate }: NeedToUpdatePrompt = await prompt([
    {
      type: 'confirm',
      name: 'needToUpdate',
      message: `Do you want to update URL Endpoint?${
        currentEndpoint ? ` (current: ${currentEndpoint})` : ''
      }`,
      initial: true,
    },
  ])

  if (!needToUpdate) {
    logger.break()
    logger.info('Skip updating URL Endpoint.')
    process.exit(0)
  }

  try {
    const newEndpoint = await URLEndpointPrompt()

    switch (type) {
      case 'liff':
        await updateLIFFApp(id, {
          view: {
            url: newEndpoint,
          },
        })
        logger.break()
        logger.success(
          `Successfully updated LIFF App (id: ${id}) to ${newEndpoint}.`,
        )

        await saveConfig({ scope: 'liff', liffId: id })

        return newEndpoint
      case 'messaging-api':
        await setWebhookEndpoint(newEndpoint)
        logger.break()
        logger.success(
          `Successfully updated Messaging API webhook to ${newEndpoint}.`,
        )

        await saveConfig({ scope: 'messaging-api', liffId: undefined })

        return newEndpoint
    }
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}
