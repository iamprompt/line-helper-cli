import { Command } from 'commander'

import { clearConfig } from '@/utils/config'

const clear = async () => {
  clearConfig()
}

export const clearCommand = new Command()
  .name('clear')
  .description('Clear configuration')
  .action(clear)
