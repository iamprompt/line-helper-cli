import { LINE_SCOPE_OPTIONS } from '@/const/options'
import { loadConfig } from '@/utils/config'
import { parseOptions } from '@/utils/options'
import { prompt } from '@/utils/prompts'

type ScopePrompt = { scopes: string }

export const LINEScopePrompt = async () => {
  const { scope } = await loadConfig()

  if (scope) {
    return scope
  }

  const { scopes }: ScopePrompt = await prompt([
    {
      type: 'select',
      name: 'scopes',
      message: 'Select LINE API Scopes',
      choices: parseOptions(LINE_SCOPE_OPTIONS),
    },
  ])

  return scopes
}
