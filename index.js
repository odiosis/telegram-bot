require('dotenv').config()

const bot = require('./lib/bot')

bot
  .install(require('./features/bilibili'))
  .install(require('./features/coin'))
  .install(require('./features/map'))
  .catch(err => {
    console.log(err)
  })

bot.help(require('./features/help'))

bot.startPolling()
