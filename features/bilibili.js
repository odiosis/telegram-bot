const queryString = require('query-string')
const Axios = require('axios')
const logger = require('../lib/logger')

const MAX_PHOTOS = 9
const PAGE_SIZE = 1

const axios = Axios.create({
  baseURL: 'https://api.vc.bilibili.com/link_draw/v2',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;',
    Connection: 'keep-alive',
    DNT: 1,
    Host: 'api.vc.bilibili.com',
    Origin: 'https://h.bilibili.com',
    Referer: 'https://h.bilibili.com/eden/picture_area',
    'Save-Data': 'on',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
  }
})

const handleMessage = (msg, category) => {
  const message = msg.text.trim().toLowerCase()
  const matchedMessage = message.match(new RegExp(`^\/${category}\\s+([0-9]+)$`))
  return matchedMessage && matchedMessage.length > 1 ? matchedMessage[1] : 0
}

const getEden = async (ctx, area, category) => {
  const num = handleMessage (ctx.message, category)

  const query = queryString.stringify({
    category,
    type: 'new',
    page_num: handleMessage(ctx.message, category),
    page_size: PAGE_SIZE
  })

  logger.info(`Fetching: Bilibili -> ${area} -> ${category} -> ${num}`)
  const resp = await axios.get(`/${area}/list?${query}`)
  const { item, user } = resp.data.data.items[0]

  const media = item.pictures.map(pic => {
    return {
      media: { url: pic.img_src },
      caption: user.name + ' - ' + item.title,
      type: 'photo'
    }
  })

  ctx.reply(`[/${category} ${num}]Finding...`)
  for (let i = 0, len = (media.length / MAX_PHOTOS); i < len; i ++) {
    await ctx.replyWithMediaGroup(media.splice(i, MAX_PHOTOS, 0))
  }
  ctx.reply(`[/${category} ${num}]Done!`)
  logger.success(`Reply: ${item.pictures.length} photos sended`)
}

const bilibili = bot => {
  bot.command('/cos', ctx => getEden(ctx, 'Photo', 'cos'))
  
  bot.command('/sifu', ctx => getEden(ctx, 'Photo', 'sifu'))

  bot.command('/illust', ctx => getEden(ctx, 'Doc', 'illustration'))

  bot.command('/comic', ctx => getEden(ctx, 'Doc', 'comic'))

  bot.command('/draw', ctx => getEden(ctx, 'Doc', 'draw'))
}

module.exports = bilibili
