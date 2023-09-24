import prompts, { Options, PromptObject } from 'prompts'

export const prompt = <T extends string = string>(
  questions: PromptObject<T> | PromptObject<T>[],
  options?: Options,
) =>
  prompts(questions, {
    onCancel: () => process.exit(0),
    ...options,
  })
