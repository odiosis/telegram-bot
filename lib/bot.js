const Telegraf = require('telegraf')
const session = require('telegraf/session')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session())

bot.install = feature => {
  feature(bot)
  return bot
}

module.exports = bot
