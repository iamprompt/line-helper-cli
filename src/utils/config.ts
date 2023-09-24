import { Config } from '@/models/config'
import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'
import { logger } from './logger'

const explorerSync = cosmiconfigSync('liff')

const gitIgnorePath = '.gitignore'
const defaultConfigPath = '.liffrc.json'

let configPath: string | null = null
let config: Config | null = null

export const loadConfig = async () => {
  if (config) return config

  const result = explorerSync.search()
  configPath = result?.filepath || defaultConfigPath
  config = result?.config || {}
  return config as Config
}

export const saveConfig = (newConfig: Config) => {
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
  logger.success('Configuration is cleared.')
}

export const saveGitIgnore = () => {
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
}
