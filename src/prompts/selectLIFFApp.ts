import { LIFFApp } from '@/models/liff'
import { createLIFFAppPrompt } from './createLIFFApp'
import { prompt } from '@/utils/prompts'

export const selectLIFFApp = async (liffApps: LIFFApp[]) => {
  const selectedResponse = await prompt([
    {
      type: 'select',
      name: 'liffApp',
      message: 'Select LIFF App to use',
      choices: [
        ...liffApps.map((liffApp) => ({
          title: `[${liffApp.liffId}] ${liffApp.description} (${liffApp.view.url})`,
          value: liffApp,
        })),
        { title: 'Create new LIFF App', value: 'create' },
      ],
    },
  ])

  const selectedLIFFApp = selectedResponse.liffApp as LIFFApp | 'create'

  if (selectedLIFFApp === 'create') {
    const newLIFFApp = await createLIFFAppPrompt()
    return newLIFFApp?.liffId as string
  }

  return selectedLIFFApp.liffId as string
}
