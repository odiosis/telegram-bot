const Markup = require('telegraf/markup')
const Parser = require('rss-parser')
const logger = require('../lib/logger')

const parser = new Parser()

const sites = [
  {
    name: '📚 阮一峰',
    url: 'http://www.ruanyifeng.com/blog/atom.xml'
  },
  {
    name: '📚 张鑫旭',
    url: 'http://www.zhangxinxu.com/wordpress/feed/'
  }
]

const rss = bot => {
  bot.command('rss', ({ reply }) => {
    return reply('选择需要获取的 rss 列表', Markup
      .keyboard(sites.map(site => site.name))
      .oneTime()
      .resize()
      .extra()
    )
  })
  sites.forEach(site => {
    bot.hears(site.name, async ctx => {
      logger.info(`Fetching: RSS -> ${site.name}`)
      const feed = await parser.parseURL(site.url)
      let content = `${feed.title}\n`

      feed.items.forEach(item => {
        content += `${item.title}: \n${item.link}\n`
      })
      logger.info(`Reply: RSS -> ${site.name}`)
      ctx.reply(content, {
        parse_mode: 'HTML'
      })
    })
  })
}

module.exports = rss
