import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { Channels } from 'preload'

contextBridge.exposeInMainWorld('ipcRenderer', {
	send(channel: Channels, args: unknown[]) {
		ipcRenderer.send(channel, args)
	},
	on(channel: Channels, handler: (...args: unknown[]) => void) {
		const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => handler(...args)
		ipcRenderer.on(channel, subscription)

		return () => ipcRenderer.removeListener(channel, subscription)
	},
	once(channel: Channels, handler: (...args: unknown[]) => void) {
		ipcRenderer.once(channel, (_event, ...args) => handler(...args))
	},
	off(channel: Channels) {
		ipcRenderer.off(channel, () => null)
	},
})

/**
 * Send the ArrayBuffer of the stream to the main process to be processed.
 */
contextBridge.exposeInMainWorld('processVideo', (ab: ArrayBuffer) => {
	ipcRenderer.send('processVideo', ab)
})

contextBridge.exposeInMainWorld('mainWindow', {
	isMaximized: async () => await ipcRenderer.invoke('isMaximized'),
	minimize: () => ipcRenderer.send('minimize'),
	maximize: () => ipcRenderer.send('maximize'),
	restore: () => ipcRenderer.send('restore'),
	close: () => ipcRenderer.send('close'),
})
