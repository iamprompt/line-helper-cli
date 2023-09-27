import { Command } from 'commander'

import { updateCommand } from '@/commands'
import { clearCommand } from '@/commands/clear'

import { setPersistedConfig } from './config'
import { getPackageInfo } from './getPackageInfo'
import { setDebugMode } from './logger'

let program: Command

export const getProgram = async () => {
  if (program) {
    return program
  }

  const packageInfo = await getPackageInfo()

  const initializeProgram = new Command()
    .name('line-helper')
    .description('LINE Helper CLI')
    .version(
      packageInfo.version || '0.0.0',
      '-v, --version',
      'print the current version of LINE Helper CLI',
    )
    .option('-d, --debug', 'print debug logs', false)
    .option('-p, --persist', 'persist credentials', false)
    .option('-change, --change-liff', 'change LIFF App', false)
    .on('option:debug', () => setDebugMode(true))
    .on('option:persist', () => setPersistedConfig(true))
    .addCommand(updateCommand)
    .addCommand(clearCommand)

  program = initializeProgram.parse(process.argv)

  return program
}

type ProgramOptions = { debug: false; persist: false; changeLiff: false }

export const getOptions = async () => {
  const program = await getProgram()
  return program.opts<ProgramOptions>()
}
