import { LIFFAppSchema } from '@/models/liff'
import { createLIFFApp } from '@/utils/line'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import { liffEndpointPrompt } from './liffEndpointPrompt'

const LIFFAppViewTypes = {
  full: 'Full',
  tall: 'Tall',
  compact: 'Compact',
}

const LIFFAppScopes = {
  openid: 'OpenID',
  email: 'Email',
  profile: 'Profile',
  'chat_message.write': 'Chat Message Write',
}

const LIFFAppBotPrompts = {
  normal: 'Normal',
  aggressive: 'Aggressive',
  none: 'None',
}

export const createLIFFAppPrompt = async () => {
  const response = await prompt([
    {
      type: 'text',
      name: 'description',
      message: 'Input LIFF App Description',
    },
    {
      type: 'select',
      name: 'type',
      message: 'Select LIFF App View Type',
      choices: Object.entries(LIFFAppViewTypes).map(([value, title]) => ({
        title,
        value,
      })),
    },
    {
      type: 'toggle',
      name: 'moduleMode',
      message: 'Enable Module Mode?',
      initial: false,
    },
    {
      type: 'toggle',
      name: 'qrCode',
      message: 'Enable QR Code?',
      initial: false,
    },
    {
      type: 'multiselect',
      name: 'scopes',
      message: 'Select LIFF App Scopes',
      choices: Object.entries(LIFFAppScopes).map(([value, title]) => ({
        title,
        value,
      })),
    },
    {
      type: 'select',
      name: 'botPrompt',
      message: 'Select LIFF App Bot Prompt',
      choices: Object.entries(LIFFAppBotPrompts).map(([value, title]) => ({
        title,
        value,
      })),
    },
  ])

  const endpoint = await liffEndpointPrompt()

  if (!endpoint) {
    process.exit(1)
  }

  const createdPayload = await LIFFAppSchema.parseAsync({
    description: response.description,
    view: {
      type: response.type,
      moduleMode: response.moduleMode,
      url: endpoint,
    },
    features: { qrCode: response.qrCode },
    scope: response.scopes,
    botPrompt: response.botPrompt,
  })

  const createdLIFFApp = await createLIFFApp(createdPayload)

  return createdLIFFApp
}
