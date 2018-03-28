const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.install = feature => {
  feature(bot)
  return bot
}

module.exports = bot
