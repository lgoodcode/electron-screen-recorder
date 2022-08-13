import { contextBridge, ipcRenderer } from 'electron'

const windowAPI = {
  isMaximized: async () => await ipcRenderer.invoke<boolean>('window:isMaximized'),
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  restore: () => ipcRenderer.send('window:restore'),
  close: () => ipcRenderer.send('window:close'),
}

contextBridge.exposeInMainWorld('mainWindow', windowAPI)

export default windowAPI
