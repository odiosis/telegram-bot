const Axios = require('axios')
const logger = require('../lib/logger')

const api = `https://data.gateio.io/api2/1/ticker`

function parseInput (ctx) {
  const params = ctx.message.text.toLowerCase().split(' ')
  console.log('params', params)
  const len = params.length
  const opts = { target: [], command: '' }

  if (len === 2) {
    const coins = params[1]

    if (coins.includes(',') ||
        coins.includes('，') ||
        coins.includes('、')
    ) {
      opts.target = coins.split(/,|，|、/)
    } else {
      opts.target = [coins]
    }
  } else {
    throw new Error('not supported syntax')
  }

  return opts
}

async function fetchDetail (type) {
  const { data } = await Axios.get(`${api}/${type}_usdt`)

  if (data.result === 'false') {
    return `${type}:\n${data.message}`
  }

  const { last, percentChange } = data

  return `${type.toUpperCase()}:\n最新成交价：*$${last}*;\n24小时变化量：${percentChange.toFixed(
    2
  )}%`
}

module.exports = function (bot) {
  bot.command('/coin', async ctx => {
    let input

    try {
      input = parseInput(ctx)
    } catch (error) {
      ctx.reply('Oooops, parsing failed')
      console.error(error)
      return
    }

    logger.info(`Fetching: Coin -> ${JSON.stringify(input)}`)

    if (input.command) {
      console.log(1)
    } else {
      let str = ''

      for (let i = 0, j = input.target.length; i < j; i++) {
        str += await fetchDetail(input.target[i])

        if (i !== input.target.length - 1) {
          str += '\n--------------------\n'
        }
      }

      await ctx.reply(str, { parse_mode: 'Markdown' })
    }

    logger.success(`Reply: coin -> ${JSON.stringify(input)}`)
  })
}
