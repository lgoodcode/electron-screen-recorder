import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('settings', {
	getRecordingsDir: async () => await ipcRenderer.invoke<string>('settings:recDir::get'),

	selectRecordingsDir: async () => await ipcRenderer.invoke<string>('settings:recDir::select'),

	updateRecordingsDir: async (path: string) =>
		await ipcRenderer.invoke<boolean>('settings:recDir::update', path),
})
