# Telegram Bot

![README 中文](https://img.shields.io/badge/README-%E4%B8%AD%E6%96%87-blue.svg)

> 致力于打造影响工作效率的电报机器人

## 使用说明

* `/help` - 获得帮助
* `/cos [n]` - 获取 b 站相簿 cosplay 区第 n 张新相片集
* `/sifu [n]` - 获取 b 站相簿私服区第 n 张新相片集
* `/illust [n]` - 获取 b 站相簿插画区第 n 张新相片集
* `/comic [n]` - 获取 b 站相簿漫画区第 n 张新相片集
* `/draw [n]` - 获取 b 站相簿其他区第 n 张新相片集
* `/coin [type]` - 获取 type 数字货币的实时信息
* `/map [location]` - 获取 location 的地图卡片
* `/translate [text]` - 翻译 text
* `/meme [text]` - 表情包 text

## 开发

* 在根目录下创建 `.env` 文件：

```conf
BOT_TOKEN=<BOT_TOKEN>
AMAP_KEY=<AMAP_KEY>
```

* 安装依赖并开启调试服务

```bash
npm i
npm run dev
```

* 开启/关闭服务

```bash
npm start
npm stop
```
