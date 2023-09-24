import { clearConfig, loadConfig } from '@/utils/config'
import { Command } from 'commander'

const clear = async () => {
  clearConfig()
}

export const clearCommand = new Command()
  .name('clear')
  .description('Clear configuration')
  .action(clear)
