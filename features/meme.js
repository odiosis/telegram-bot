const axios = require('axios')
const cheerio = require('cheerio')
const logger = require('../lib/logger')

const KEY = 'data-original'
const headers = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;',
  Connection: 'keep-alive',
  referer: 'https://www.doutula.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
}

async function meme (ctx, keyword) {
  const {
    data: html
  } = await axios.get(
    `https://www.doutula.com/search?keyword=${encodeURIComponent(keyword)}`, {
      headers
    }
  )
  let index

  const $ = cheerio.load(html)

  const target = $('.random_picture img').toArray()

  const imgs = target
    .filter(item => item.name === 'img' && item.attribs[KEY])
    .map(item => {
      const url = item.attribs[KEY]

      return url
    })

  if (imgs.length) {
    index = Math.round(Math.random() * (imgs.length - 1))

    ctx.replyWithPhoto({
      url: imgs[index], filename: `${keyword}.jpg`
    })
  } else {
    await meme(ctx, '问号')
  }
}

function parseInput (msg) {
  return msg.toLowerCase().split(' ')
}

module.exports = async function (bot) {
  bot.command('/meme', async ctx => {
    let input

    try {
      input = parseInput(ctx.message.text)
    } catch (error) {
      ctx.reply('Oooops, parsing failed')
      return
    }

    logger.info(`Fetching: Meme -> ${input}`)

    await meme(ctx, input[1])

    logger.success(`Reply: Meme -> ${input}`)
  })
}
