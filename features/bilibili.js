
const Extra = require('telegraf/extra')
const Router = require('telegraf/router')
const queryString = require('query-string')
const Axios = require('axios')
const logger = require('../lib/logger')

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
  const matchedMessage = message.match(new RegExp(`^/${category}\\s+([0-9]+)$`))
  return matchedMessage && matchedMessage.length > 1 ? matchedMessage[1] : 0
}

function createInlineKeyboard (m, item) {
  return m.inlineKeyboard([
    ...item.pictures.map((pic, index) => {
      return m.callbackButton(`${index + 1}`, `${item.poster_uid}-${index}`)
    })
  ],
  { columns: 3 })
}

const getEden = async (bot, ctx, area, category) => {
  const num = handleMessage(ctx.message, category)

  const query = queryString.stringify({
    category,
    type: 'new',
    page_num: handleMessage(ctx.message, category),
    page_size: 1
  })

  logger.info(`Fetching: Bilibili -> ${area} -> ${category} -> ${num}`)
  const resp = await axios.get(`/${area}/list?${query}`)
  const { item, user } = resp.data.data.items[0]

  const markup = Extra
    .HTML()
    .markup(m => createInlineKeyboard(m, item))

  // create router
  const router = new Router(({ callbackQuery }) => {
    if (!callbackQuery.data) return
    return {
      route: callbackQuery.data
    }
  })

  item.pictures.forEach((pic, index) => {
    router.on(`${item.poster_uid}-${index}`, async ctx => {
      const meta = ctx.update.callback_query.from
      const username = meta.username || (meta.first_name + meta.last_name)
      ctx.reply(`[/${category} ${num}]${username}: Finding... ${index + 1}`)
      logger.info(`Sending: Bilibili -> ${area} -> ${category} -> ${num} -> ${index}`)
      await ctx.replyWithPhoto({
        url: pic.img_src
      })
      logger.success(`Reply: Bilibili -> ${area} -> ${category} -> ${num} -> ${index}`)
    })
  })

  // send inline keyboard
  await ctx.reply(`<b>${user.name}</b> - ${item.title}`, markup)

  bot.on('callback_query', router)
}

const bilibili = bot => {
  bot.command('/cos', ctx => getEden(bot, ctx, 'Photo', 'cos'))

  bot.command('/sifu', ctx => getEden(bot, ctx, 'Photo', 'sifu'))

  bot.command('/illust', ctx => getEden(bot, ctx, 'Doc', 'illustration'))

  bot.command('/comic', ctx => getEden(bot, ctx, 'Doc', 'comic'))

  bot.command('/draw', ctx => getEden(bot, ctx, 'Doc', 'draw'))
}

module.exports = bilibili
