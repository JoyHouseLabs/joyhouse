// 用于 Electron 主进程启动本地 Express+TypeORM 服务
const path = require('path')
const { fork } = require('child_process')

// 启动 server/index.ts（用 ts-node），或 server/index.js（编译后）
function startServer() {
  const serverPath = path.join(__dirname, '../server/index.ts')
  // 你可以根据实际情况切换为 index.js
  const child = fork(
    require.resolve('ts-node/dist/bin.js'),
    [serverPath],
    {
      env: {
        ...process.env,
        DB_TYPE: 'sqlite',
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
      stdio: 'inherit'
    }
  )
  child.on('error', (err) => {
    console.error('本地服务启动失败:', err)
  })
}

module.exports = { startServer }
