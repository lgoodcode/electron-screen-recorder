import { app, dialog, ipcMain } from 'electron'
import { stat, mkdir } from 'fs'
import { join } from 'path'
import store from './store'
import validateIpcSender from '../../lib/validateIpcSender'

/**
 * Initialize the recordings location from config file
 */
app.on('ready', () => {
	if (!store.has('recordingsDir')) {
		const path = join(app.getPath('userData'), 'recordings')

		store.set('recordingsDir', path)

		stat(path, (err) => {
			if (err) {
				mkdir(path, (err) => {
					if (err) {
						throw new Error('Failed to create default recordings directory: ' + path)
					}
				})
			}
		})
	}
})

/**
 * Retrieves the recordings location from config file
 */
ipcMain.handle('settings:recDir::get', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return store.get('recordingsDir')
})

ipcMain.handle('settings:recDir::select', async (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	const { filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
		title: 'Select recordings directory',
	})

	return filePaths[0]
})

ipcMain.handle('settings:recDir::update', (event, path) => {
	if (!validateIpcSender(event.senderFrame)) return

	if (!path) return false

	return new Promise<boolean>((res) =>
		stat(path, (err, stats) => {
			// If directory doesn't exist it will contain an error
			if (err || !stats.isDirectory()) {
				return res(false)
			}

			// Update the recordings directory
			store.set('recordingsDir', path)

			res(true)
		})
	)
})
