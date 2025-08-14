"use strict";
const electron = require("electron");
let selectedFile = null;
electron.contextBridge.exposeInMainWorld("sdk", {
  readFile: async ({ range }) => {
    if (!selectedFile) {
      const filePath = await electron.ipcRenderer.invoke("sdk:selectFile");
      if (!filePath) return { result: { code: 1, msg: "用户未选择文件" } };
      const response = await fetch(`file://${filePath}`);
      const blob = await response.blob();
      selectedFile = new File([blob], filePath);
    }
    const file = selectedFile;
    const [start, end] = range;
    const sliceEnd = Math.min(end + 1, file.size, start + 1024 * 1024);
    const arrayBuffer = await file.slice(start, sliceEnd).arrayBuffer();
    const finished = sliceEnd >= file.size;
    const mimeType = file.name.split(".").pop() || null;
    return { result: { code: 0 }, data: { arrayBuffer, finished, mimeType } };
  },
  openUrl: async (options) => electron.ipcRenderer.invoke("sdk:openUrl", options),
  onOpenWebview: (callback) => electron.ipcRenderer.on("sdk:openWebview", (_, url) => {
    callback(url);
  })
});
