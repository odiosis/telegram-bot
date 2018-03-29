const logger = require('../lib/logger')

const helper = `
/helper: 获取帮助
/cos [n]: 获取 b 站相簿 cosplay 区第 n 张新相片集
/sifu [n]: 获取 b 站相簿私服区第 n 张新相片集
/illust [n]: 获取 b 站相簿插画区第 n 张新相片集
/comic [n]: 获取 b 站相簿漫画区第 n 张新相片集
/draw [n]: 获取 b 站相簿其他区第 n 张新相片集
`

const help = bot => {
  bot.command('/help', async ctx => {
    logger.info(`Fetching: Help`)
    const replyer = await ctx.reply(helper)
    logger.success(`Reply: help list sended`)
  })
}

module.exports = help
