const googleTranslate = require('google-translate-api')
const logger = require('../lib/logger')

const handleMessage = msg => {
  const message = msg.text.trim().toLowerCase()
  const matchedMessage = message.split(' ')
  return matchedMessage && matchedMessage.length > 1 ? matchedMessage[1] : ''
}

const translate = bot => {
  bot.command('/translate', async ctx => {
    const keywords = handleMessage(ctx.message)

    let enFlag = 0
    let zhFlag = 0
    const arr = keywords.split('')
    for (let item of arr) {
      const len = item.charCodeAt().toString().length
      if (len <= 3) enFlag++
      if (len > 3) zhFlag++
    }

    logger.info(`Fetching: Translate -> ${keywords}`)
    const resp = await googleTranslate(keywords, { to: enFlag >= zhFlag ? 'zh-cn' : 'en' })

    ctx.reply(resp.text)

    logger.success(`Reply: Translate -> ${keywords}: ${resp.text}`)
  })
}

module.exports = translate
