import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'

import { Config } from '@/models/config'

import { logger } from './logger'
import { getOptions } from './program'

const explorerSync = cosmiconfigSync('liff')

const gitIgnorePath = '.gitignore'
const defaultConfigPath = '.liffrc.json'

let configPath: string | null = null
let config: Config | null = null

export const loadConfig = async () => {
  if (config) return config

  const result = explorerSync.search()

  if (result) {
    logger.info(`Using config file: ${result.filepath}`)
  }

  configPath = result?.filepath || defaultConfigPath
  config = result?.config || {}
  return config as Config
}

export const saveConfig = async (newConfig: Config) => {
  const { scope } = config || {}
  const { update: { config: saveConfig } = {} } = await getOptions()

  if (!saveConfig && (config === null || !scope)) return

  if (!configPath) {
    throw new Error('Config path is not defined.')
  }

  config = {
    ...config,
    ...newConfig,
  }

  fs.writeJSONSync(configPath, config, { spaces: 2 })
  saveGitIgnore()

  return config
}

export const clearConfig = () => {
  fs.removeSync(defaultConfigPath)
  logger.break()
  logger.success('Configuration is cleared.')
}

export const saveGitIgnore = () => {
  try {
    if (!configPath) {
      throw new Error('Config path is not defined.')
    }

    const gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf-8')

    if (!gitIgnoreContent.includes(defaultConfigPath)) {
      fs.appendFileSync(
        gitIgnorePath,
        `\n\n# LIFF Helper CLI\n${defaultConfigPath}\n`,
      )
    }
  } catch (error) {
    logger.info('No .gitignore file found, creating one...')
    fs.writeFileSync(gitIgnorePath, `# LIFF Helper CLI\n${defaultConfigPath}\n`)
  }
}
