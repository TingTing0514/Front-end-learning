import { ipcMain as l, dialog as a, BrowserWindow as i, app as s } from "electron";
import { fileURLToPath as d } from "url";
import o from "path";
const c = d(import.meta.url), r = o.dirname(c);
function w() {
  new i({
    width: 800,
    height: 600,
    webPreferences: {
      preload: o.join(r, "preload.mjs"),
      // 预加载 SDK
      contextIsolation: !0,
      nodeIntegration: !1,
      webSecurity: !0,
      webviewTag: !0
      // 允许渲染进程使用 <webview>
    }
  }).loadFile(o.join(r, "../dist/index.html"));
}
l.handle("sdk:selectFile", async () => {
  const e = await a.showOpenDialog({ properties: ["openFile"] });
  return e.canceled || !e.filePaths.length ? null : e.filePaths[0];
});
l.handle("sdk:openUrl", async (e, n) => {
  try {
    if (console.log("options", n), n.options.type === "browserwindow")
      new i({ width: 800, height: 600 }).loadURL(n.url);
    else if (n.options.type === "webview") {
      const t = i.getFocusedWindow();
      t && t.webContents.send("sdk:openWebview", n.url);
    }
    return { code: 0 };
  } catch (t) {
    return { code: 1, msg: t.message };
  }
});
s.whenReady().then(w);
