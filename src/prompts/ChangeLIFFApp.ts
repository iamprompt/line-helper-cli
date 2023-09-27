import { prompt } from '@/utils/prompts'

type ChangeLIFFAppPrompt = { toChange: boolean }

export const ChangeLIFFPrompt = async () => {
  const { toChange }: ChangeLIFFAppPrompt = await prompt([
    {
      type: 'confirm',
      name: 'toChange',
      message: 'Do you want to change LIFF App?',
      initial: false,
    },
  ])

  return toChange
}
