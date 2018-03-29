require('dotenv').config()

const bot = require('./lib/bot')

bot
  .install(require('./features/help'))
  .install(require('./features/bilibili'))
  .install(require('./features/coin'))
  .catch(err => {
    console.log(err)
  })

bot.startPolling()
