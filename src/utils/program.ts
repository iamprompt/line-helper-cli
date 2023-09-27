import { Command } from 'commander'

import { UpdateCommand } from '@/commands'
import { clearCommand } from '@/commands/clear'

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
    .on('option:debug', () => setDebugMode(true))
    .addCommand(UpdateCommand)
    .addCommand(clearCommand)

  program = initializeProgram.parse(process.argv)

  return program
}

type ProgramOptions = { debug: false }
type UpdateOptions = { changeLiff: boolean; config: boolean }

export const getOptions = async () => {
  const programOpts = program.opts<ProgramOptions>()
  const updateOpts = UpdateCommand.opts<UpdateOptions>()

  return {
    program: programOpts,
    update: updateOpts,
  }
}
