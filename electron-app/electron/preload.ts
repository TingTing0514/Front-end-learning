import { contextBridge, ipcRenderer } from "electron";

let selectedFile:File| null = null;

contextBridge.exposeInMainWorld("sdk", {
  readFile: async ({ range }) => {
    if (!selectedFile) {
      const filePath = await ipcRenderer.invoke("sdk:selectFile");
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

  openUrl: async (options) => ipcRenderer.invoke("sdk:openUrl", options),
  onOpenWebview: (callback) =>
    ipcRenderer.on("sdk:openWebview", (_, url) => {
      callback(url);
    }),
});
