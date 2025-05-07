const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const Store = require('electron-store')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

// 配置日志
log.initialize({ preload: true })
log.transports.file.level = 'info'
log.info('应用启动')

// 初始化配置存储
const store = new Store()

// 配置自动更新
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.logger = log

// 配置更新服务器
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'your-github-username',
  repo: 'joyhouse',
  token: process.env.GH_TOKEN
})

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 开发环境下加载本地服务
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境下加载打包后的文件
    const indexPath = path.join(__dirname, '../dist/index.html')
    log.info('加载页面:', indexPath)
    mainWindow.loadFile(indexPath)
    
    // 禁用开发者工具
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.key.toLowerCase() === 'i') {
        event.preventDefault()
      }
    })
  }

  // 处理窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 检查更新
function checkForUpdates() {
  autoUpdater.checkForUpdates()
}

// 自动更新事件处理
autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update-available', info)
  dialog.showMessageBox({
    type: 'info',
    title: '发现新版本',
    message: `发现新版本 ${info.version}，是否更新？\n\n更新内容：\n${info.releaseNotes || '暂无更新说明'}`,
    buttons: ['是', '否']
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('download-progress', progressObj)
})

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update-downloaded', info)
  dialog.showMessageBox({
    type: 'info',
    title: '更新就绪',
    message: '新版本已下载完成，是否立即安装？',
    buttons: ['是', '否']
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-error', err.message)
  dialog.showErrorBox('更新错误', err.message)
})

app.whenReady().then(() => {
  createWindow()
  
  // 检查更新
  if (process.env.NODE_ENV !== 'development') {
    checkForUpdates()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 处理IPC通信
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key)
})

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value)
  return true
})

// 检查更新IPC
ipcMain.handle('check-for-updates', () => {
  checkForUpdates()
})

// 获取系统语言
ipcMain.handle('get-system-locale', () => {
  return app.getLocale()
}) 