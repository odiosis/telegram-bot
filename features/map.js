const queryString = require('query-string')
const Axios = require('axios')
const logger = require('../lib/logger')

const axios = Axios.create({
  baseURL: 'https://restapi.amap.com/v3'
})

const handleMessage = msg => {
  const message = msg.text.trim().toLowerCase()
  const matchedMessage = message.split(' ')
  return matchedMessage && matchedMessage.length > 1 ? matchedMessage[1] : ''
}

const map = bot => {
  bot.command('/map', async ctx => {
    const keywords = handleMessage(ctx.message)

    const query = queryString.stringify({
      key: process.env.AMAP_KEY,
      keywords,
      offset: 3
    })

    logger.info(`Fetching: Map -> ${keywords}`)

    const resp = await axios.get(`/place/text?${query}`)
    const { pois } = resp.data
    if (pois.length > 0) {
      const location = pois[0].location.split(',')

      await ctx.replyWithLocation(location[1], location[0])
    } else {
      ctx.reply('地址不够详细或查无此处？')
    }

    logger.success(`Reply: Map -> ${keywords}`)
  })
}

module.exports = map
