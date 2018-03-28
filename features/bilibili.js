const queryString = require('query-string')
const Axios = require('axios')

const axios = Axios.create({
  baseURL: 'https://api.vc.bilibili.com/link_draw/v2'
})

const getPics = async (ctx, category) => {
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
  const resp = await axios.get(`/Photo/list?${query}`)
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
  bot.command('/cos', ctx => {
    getPics(ctx, 'cos')
  })
  
  bot.command('/jk', ctx => {
    getPics(ctx, 'jk')
  })
}

module.exports = bilibili
