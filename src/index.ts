#!/usr/bin/env node

import { logger } from './utils/logger'
import { getProgram } from './utils/program'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

const main = async () => {
  logger.info('--> LINE Helper CLI <--')
  await getProgram()
}

main()
