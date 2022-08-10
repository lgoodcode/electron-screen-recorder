import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('mainWindow', {
	isMaximized: async () => await ipcRenderer.invoke<boolean>('window:isMaximized'),
	minimize: () => ipcRenderer.send('window:minimize'),
	maximize: () => ipcRenderer.send('window:maximize'),
	restore: () => ipcRenderer.send('window:restore'),
	close: () => ipcRenderer.send('window:close'),
})
