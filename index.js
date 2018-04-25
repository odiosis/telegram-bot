require('dotenv').config()

const bot = require('./lib/bot')

bot
  .install(require('./features/bilibili'))
  .install(require('./features/coin'))
  .install(require('./features/map'))
  .install(require('./features/translate'))
  .install(require('./features/rss'))
  .install(require('./features/meme'))
  .install(require('./features/fund'))
  .catch(err => {
    console.log(err)
  })

bot.help(require('./features/help'))

bot.startPolling()
