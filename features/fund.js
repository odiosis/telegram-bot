const queryString = require('query-string')
const Axios = require('axios')
const html2json = require('html2json').html2json
const logger = require('../lib/logger')

const axios = Axios.create({
  baseURL: 'http://fund.eastmoney.com'
})

const handleMessage = msg => {
  const message = msg.text.trim().toLowerCase()
  const matchedMessage = message.split(' ')
  return matchedMessage && matchedMessage.length > 1 ? matchedMessage[1] : ''
}

const map = bot => {
  bot.command('/fund', async ctx => {
    const code = handleMessage(ctx.message)

    const query = queryString.stringify({
      type: 'lsjz',
      code,
      page: 1,
      per: 1
    })

    logger.info(`Fetching: Fund -> ${code}`)

    const resp = await axios.get(`/f10/F10DataApi.aspx?${query}`)
    const content = html2json(resp.data.match(/<table.*>.*?<\/table>/)[0])
      .child[0].child
      .find(item => item.tag === 'tbody')
      .child[0].child
      .map(item => {
        if (item.child) {
          return item.child[0].text
        } else {
          return ''
        }
      })

    const reply = `[基金编号：<b>${code}</b>]\n` +
      `日期：<b>${content[0]}</b>\n` +
      `净值：<b>${content[1]}</b>\n` +
      `累计净值：<b>${content[2]}</b>\n` +
      `日增长率：<b>${content[3]}</b>`

    ctx.reply(reply, {
      parse_mode: 'HTML'
    })

    logger.success(`Reply: Fund -> ${code}`)
  })
}

module.exports = map
