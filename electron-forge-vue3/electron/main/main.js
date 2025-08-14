import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // 预加载 SDK
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      webviewTag: true, // 允许渲染进程使用 <webview>
    },
  })

  win.loadFile(path.join(__dirname, '../dist/index.html'))
  // win.loadURL('http://localhost:5173')
  // win.webContents.openDevTools()
}

// 弹出文件选择框
ipcMain.handle('sdk:selectFile', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (result.canceled || !result.filePaths.length) return null
  return result.filePaths[0] // 返回用户选择的文件路径
})

// 打开 URL
ipcMain.handle('sdk:openUrl', async (_, options) => {
  try {
    console.log('options', options)

    if (options.options.type === 'browserwindow') {
      const child = new BrowserWindow({ width: 800, height: 600 })
      child.loadURL(options.url)
    } else if (options.options.type === 'webview') {
      const parent = BrowserWindow.getFocusedWindow()
      if (parent) {
        parent.webContents.send('sdk:openWebview', options.url)
      }
    }
    return { code: 0 }
  } catch (err) {
    return { code: 1, msg: err.message }
  }
})

app.whenReady().then(createWindow)
