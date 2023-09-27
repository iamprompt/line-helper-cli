import chalk from 'chalk'

let isDebug = true

export const setDebugMode = (debugMode: boolean) => {
  isDebug = debugMode
}

export const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args))
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args))
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args))
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args))
  },
  break() {
    console.log('')
  },
}

export const debug = {
  log(...args: unknown[]) {
    if (isDebug) {
      console.log(chalk.bgGray('[Debug]'), ...args)
    }
  },
  error(...args: unknown[]) {
    debug.log(chalk.red(...args))
  },
  warn(...args: unknown[]) {
    debug.log(chalk.yellow(...args))
  },
  info(...args: unknown[]) {
    debug.log(chalk.cyan(...args))
  },
  success(...args: unknown[]) {
    debug.log(chalk.green(...args))
  },
  break() {
    debug.log('')
  },
}
