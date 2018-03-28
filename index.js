require('dotenv').config()

const bot = require('./lib/bot')

bot
  .install(require('./features/bilibili'))
  .catch(err => {
    console.log(err)
  })

bot.startPolling()
