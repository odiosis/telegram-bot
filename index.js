require('dotenv').config()
const Telegraf = require('telegraf')
const Axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN)

const axios = Axios.create({
  baseURL: 'https://api.vc.bilibili.com/link_draw/v2'
})

bot.command('/pics', async ctx => {
  console.log(`Fetching Start`)
  const message = ctx.message.text.trim().toLowerCase()
  let num = 0
  try {
    num = message.match(/^\/pics ([0-9]+)$/)[1]
  } catch (e) {
    num = 0
  }
  console.log(`Fetching pics with num: ${num}`)

  const resp = await axios.get(`/Photo/list?category=cos&type=new&page_num=${num}&page_size=1`)
  const { data } = resp.data
  const items = data.items

  const media = items[0].item.pictures.map(pic => {
    return {
      media: { url: pic.img_src },
      caption: items[0].user.name + ' - ' + items[0].item.title,
      type: 'photo'
    }
  })

  ctx.replyWithMediaGroup(media)
})

bot.catch(err => {
  console.log(err)
})

bot.startPolling()
