import { ipcMain, dialog, BrowserWindow, app, globalShortcut } from "electron";
import path from "path";
import { fileURLToPath } from "url";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      // 禁用node.js
      contextIsolation: true,
      // 启用上下文隔离
      webSecurity: true,
      webviewTag: true
      // 允许渲染进程使用 <webview>
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};
ipcMain.handle("sdk:selectFile", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openFile"] });
  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});
ipcMain.handle("sdk:openUrl", async (_, options) => {
  try {
    console.log("options", options);
    if (options.options.type === "browserwindow") {
      const child = new BrowserWindow({ width: 800, height: 600 });
      child.loadURL(options.url);
    } else if (options.options.type === "webview") {
      const parent = BrowserWindow.getFocusedWindow();
      if (parent) {
        parent.webContents.send("sdk:openWebview", options.url);
      }
    }
    return { code: 0 };
  } catch (err) {
    return { code: 1, msg: err.message };
  }
});
app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
app.whenReady().then(() => {
  const ret = globalShortcut.register("CommandOrControl+X", () => {
    BrowserWindow.getAllWindows()[0].webContents.openDevTools();
  });
  if (!ret) {
    console.log("registration failed");
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  globalShortcut.unregister("CommandOrControl+X");
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") app.quit();
});
