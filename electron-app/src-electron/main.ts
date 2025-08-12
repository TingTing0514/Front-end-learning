import { app, BrowserWindow } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
  })

  if (process.env.NODE_ENV === 'development') {
    // console.log(process.env);
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools() // 打开开发者工具
  } else {
    win.loadURL('http://localhost:5173')
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
