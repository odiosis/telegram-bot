const queryString = require('query-string')
const Axios = require('axios')

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

const getEden = async (ctx, Area, category) => {
  const message = ctx.message.text.trim().toLowerCase()
  let num = 0
  try {
    num = message.match(new RegExp(`^\/${category}\s+([0-9]+)$`))[1]
  } catch (e) {
    num = 0
  }

  const query = queryString.stringify({
    category,
    type: 'new',
    page_num: num,
    page_size: 1
  })
  const resp = await axios.get(`/${Area}/list?${query}`)
  const { data } = resp.data
  const { item, user } = data.items[0]

  const media = item.pictures.map(pic => {
    return {
      media: { url: pic.img_src },
      caption: user.name + ' - ' + item.title,
      type: 'photo'
    }
  })

  ctx.replyWithMediaGroup(media.splice(0, 10))
}

const bilibili = bot => {
  bot.command('/cos', ctx => getEden(ctx, 'Photo', 'cos'))
  
  bot.command('/sifu', ctx => getEden(ctx, 'Photo', 'sifu'))

  bot.command('/illust', ctx => getEden(ctx, 'Doc', 'illustration'))

  bot.command('/comic', ctx => getEden(ctx, 'Doc', 'comic'))

  bot.command('/draw', ctx => getEden(ctx, 'Doc', 'draw'))
}

module.exports = bilibili
