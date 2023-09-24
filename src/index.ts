#!/usr/bin/env node

import { Command } from 'commander'
import { getPackageInfo } from '@/utils/getPackageInfo'
import { initCommand, updateCommand } from '@/commands'
import { getCredentials } from './prompts/getCredentials'
import { logger } from './utils/logger'
import { clearCommand } from './commands/clear'

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
    .addCommand(initCommand)
    .addCommand(updateCommand)
    .addCommand(clearCommand)

  logger.info('--> LIFF Helper CLI <--')

  program.parse(process.argv)
}

main()
