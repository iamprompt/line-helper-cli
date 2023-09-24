import { LIFFApp } from '@/models/liff'
import { updateLIFFApp } from '@/utils/line'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'

export const updateLIFFEndpointPrompt = async (liff: LIFFApp) => {
  const { needToUpdate } = await prompt([
    {
      type: 'confirm',
      name: 'needToUpdate',
      message:
        'Do you want to update LIFF Endpoint? (current: ' + liff.view.url + ')',
      initial: true,
    },
  ])

  if (!needToUpdate) {
    return liff
  }

  const { endpoint } = await prompt([
    {
      type: 'text',
      name: 'endpoint',
      message: 'Input LIFF Endpoint URL',
      validate: validateUrl,
    },
  ])

  return await updateLIFFApp(liff.liffId!, {
    view: {
      url: endpoint,
    },
  })
}
