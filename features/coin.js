const Axios = require('axios')
const logger = require('../lib/logger')

const api = `http://data.gateio.io/api2/1/ticker`

function getType (msg) {
  return msg.toLowerCase().split(' ')[1]
}

async function fetchDetail (type) {
  const { data } = await Axios.get(`${api}/${type}_usdt`)

  if (data.result === 'false') {
    return data.message
  }

  const { last, percentChange } = data

  return `${type.toUpperCase()}:\n最新成交价：*$${last}*;\n24小时变化量：${percentChange.toFixed(
    2
  )}%`
}

module.exports = function (bot) {
  bot.command('/coin', async ctx => {
    let type

    try {
      type = getType(ctx.message.text)
    } catch (error) {
      ctx.reply('Oooops, parsing failed')
      return
    }

    logger.info(`Fetching: Coin -> ${type}`)

    await ctx.reply(await fetchDetail(type), {
      parse_mode: 'Markdown'
    })

    logger.success(`Reply: coin -> ${type}`)
  })
}
