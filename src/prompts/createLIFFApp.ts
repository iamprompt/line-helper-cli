import { LIFFAppSchema } from '@/models/liff'
import { createLIFFApp } from '@/services/line'
import { prompt } from '@/utils/prompts'
import { validateUrl } from '@/utils/validations'
import { URLEndpointPrompt } from './URLEndpoint'
import { parseOptions } from '@/utils/options'
import {
  LIFF_APP_BOT_PROMPT_OPTIONS,
  LIFF_APP_SCOPE_OPTIONS,
  LIFF_APP_VIEW_TYPE_OPTIONS,
} from '@/const/options'
import { logger } from '@/utils/logger'

type PromptResponse = {
  description: string
  type: string
  moduleMode: boolean
  qrCode: boolean
  scopes: string[]
  botPrompt: string
}

export const CreateLIFFAppPrompt = async () => {
  const res: PromptResponse = await prompt([
    {
      type: 'text',
      name: 'description',
      message: 'Input LIFF App Description',
    },
    {
      type: 'select',
      name: 'type',
      message: 'Select LIFF App View Type',
      choices: parseOptions(LIFF_APP_VIEW_TYPE_OPTIONS),
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
      choices: parseOptions(LIFF_APP_SCOPE_OPTIONS),
    },
    {
      type: 'select',
      name: 'botPrompt',
      message: 'Select LIFF App Bot Prompt',
      choices: parseOptions(LIFF_APP_BOT_PROMPT_OPTIONS),
    },
  ])

  try {
    const endpoint = await URLEndpointPrompt()
    const payload = await LIFFAppSchema.parseAsync({
      description: res.description,
      view: {
        type: res.type,
        moduleMode: res.moduleMode,
        url: endpoint,
      },
      features: { qrCode: res.qrCode },
      scope: res.scopes,
      botPrompt: res.botPrompt,
    })

    return await createLIFFApp(payload)
  } catch (error) {
    logger.error(error)
    throw error
  }
}
