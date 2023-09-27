#!/usr/bin/env node

import { Command } from 'commander'
import { getPackageInfo } from '@/utils/getPackageInfo'
import { initCommand, updateCommand } from '@/commands'
import { getCredentials } from './prompts/getCredentials'
import { logger, setDebugMode } from './utils/logger'
import { clearCommand } from './commands/clear'
import { setPersistedConfig } from './utils/config'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

type Options = {
  debug: boolean
  persist: boolean
}

const main = async () => {
  const packageInfo = await getPackageInfo()

  const program = new Command()
    .name('liff-helper')
    .description('LIFF Helper CLI')
    .version(
      packageInfo.version || '0.0.0',
      '-v, --version',
      'print the current version of LIFF Helper CLI',
    )
    .option('-d, --debug', 'print debug logs', false)
    .option('-p, --persist', 'persist credentials', false)
    .on('option:debug', () => setDebugMode(true))
    .on('option:persist', () => setPersistedConfig(true))
    .addCommand(initCommand)
    .addCommand(updateCommand)
    .addCommand(clearCommand)

  logger.info('--> LIFF Helper CLI <--')

  program.parse(process.argv)
}

main()
