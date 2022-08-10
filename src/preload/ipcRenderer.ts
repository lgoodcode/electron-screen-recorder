import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { Channels } from 'preload'

contextBridge.exposeInMainWorld('ipcRenderer', {
	send(channel: Channels, ...args: unknown[]) {
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
})
