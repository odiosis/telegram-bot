const fecha = require('fecha')
const chalk = require('chalk')

const log = console.log
const now = fecha.format(new Date(), 'YYYY-MM-DD hh:mm:ss.SSS A')

const logger = {
  info (msg) {
    log(chalk.cyan(`[${now}] BOT: ${msg}`))
  },

  success (msg) {
    log(chalk.green(`[${now}] BOT: ${msg}`))
  }
}

module.exports = logger
