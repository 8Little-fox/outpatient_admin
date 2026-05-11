const path = require('node:path')
const express = require('express')

const app = express()
const port = 3000

// 设置静态文件目录
const staticPath = path.join(__dirname, 'dist') // 假设 dist 是你的构建输出目录
app.use(express.static(staticPath))

// 处理所有路由请求，回退到 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

// 启动服务器
app.listen(port, () => {
  console.warn(`服务器运行在 http://localhost:${port}`)
})
