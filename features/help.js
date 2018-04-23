const logger = require('../lib/logger')

const helper = `
/help: 获取帮助
/cos [n]: 获取 b 站相簿 cosplay 区第 n 张新相片集
/sifu [n]: 获取 b 站相簿私服区第 n 张新相片集
/illust [n]: 获取 b 站相簿插画区第 n 张新相片集
/comic [n]: 获取 b 站相簿漫画区第 n 张新相片集
/draw [n]: 获取 b 站相簿其他区第 n 张新相片集
/coin: 获取市值前10数字货币实时信息
/coin [type]: 获取 type 数字货币的实时信息
/coin [type],[type]...: 获取 type 数字货币的实时信息
/map [location]: 获取 location 的地图卡片
/translate [text]: 翻译 text
/rss: 获取预设博客的 rss
/meme [text]: 表情包 text
`

const help = async ctx => {
  logger.info(`Fetching: Help`)
  await ctx.reply(helper)
  logger.success(`Reply: help list sended`)
}

module.exports = help
