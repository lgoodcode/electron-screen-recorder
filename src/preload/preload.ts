import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { Channels } from 'preload'

ipcRenderer.on('will-quit', () => localStorage.removeItem('currentStreamId'))

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
 * videoStream API
 *
 * Handles dealing with the video stream and passing it between the main and
 * renderer processes. Manages the current stream and the retrieving previously
 * saved recordings.
 */
contextBridge.exposeInMainWorld('videoStream', {
	getVideoSources: () => ipcRenderer.send('getVideoSources'),
	// Specify the default handler type to satisfy the `on` handler but the
	// actual argument is going to be the id string of the selected video source.
	handleVideoSource: (handler: (...args: unknown[]) => void) =>
		ipcRenderer.on('getVideoSources', (_event, args: unknown[]) => handler(args)),
	// processVideo: (ab: ArrayBuffer) => ipcRenderer.send('processVideo', ab),
	processVideo: async (ab: ArrayBuffer) => await ipcRenderer.invoke('processVideo', ab),
	currentStream: {
		get: async () => await ipcRenderer.invoke('getCurrentStream'),
		set: (id: string) => ipcRenderer.send('setCurrentStream', id),
		clear: () => ipcRenderer.send('clearCurrentStream'),
	},
	getRecordings: async () => await ipcRenderer.invoke('getRecordings'),
})

/**
 * settings API
 */
contextBridge.exposeInMainWorld('settings', {
	getRecordingsDir: async () => await ipcRenderer.invoke('getRecordingsDir'),
	selectRecordingsDir: async () => await ipcRenderer.invoke('selectRecordingsDir'),
	updateRecordingsDir: async (path: string) =>
		await ipcRenderer.invoke('updateRecordingsDir', path),
})

/**
 * mainWindow API
 */
contextBridge.exposeInMainWorld('mainWindow', {
	isMaximized: async () => await ipcRenderer.invoke('isMaximized'),
	minimize: () => ipcRenderer.send('minimize'),
	maximize: () => ipcRenderer.send('maximize'),
	restore: () => ipcRenderer.send('restore'),
	close: () => ipcRenderer.send('close'),
})
