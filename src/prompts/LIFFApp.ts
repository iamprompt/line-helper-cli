import { LIFFApp } from '@/models/liff'
import { saveConfig } from '@/utils/config'
import { logger } from '@/utils/logger'
import { parseOptions } from '@/utils/options'
import { prompt } from '@/utils/prompts'

import { CreateLIFFAppPrompt } from './CreateLIFFApp'

export const LIFFAppPrompt = async (
  apps: LIFFApp[],
  create: boolean = true,
): Promise<[string, boolean]> => {
  const LIFF_APPS_OPTIONS = apps.map((app) => ({
    title: `[${app.liffId}] ${app.description} (${app.view.url})`,
    value: app,
  }))

  const { liffId = 'create' } = await prompt([
    {
      type: apps.length ? 'select' : null,
      name: 'liffId',
      message: 'Select LIFF App to use',
      choices: [
        ...LIFF_APPS_OPTIONS,
        ...parseOptions({
          ...(create ? { create: 'Create new LIFF App' } : {}),
        }),
      ],
    },
  ])

  const selectedLIFFApp = liffId as LIFFApp | 'create'

  if (selectedLIFFApp === 'create') {
    const newLIFFApp = await CreateLIFFAppPrompt()
    if (!newLIFFApp) {
      logger.error('Failed to create new LIFF App')
      process.exit(1)
    }

    return [newLIFFApp.liffId, true]
  }

  saveConfig({ scope: 'liff', liffId: selectedLIFFApp.liffId })

  return [selectedLIFFApp.liffId as string, false]
}
