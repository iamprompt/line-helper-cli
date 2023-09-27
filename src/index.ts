#!/usr/bin/env node

import { Command } from 'commander'

import { initCommand, updateCommand } from '@/commands'
import { getPackageInfo } from '@/utils/getPackageInfo'

import { clearCommand } from './commands/clear'
import { setPersistedConfig } from './utils/config'
import { logger, setDebugMode } from './utils/logger'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

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
