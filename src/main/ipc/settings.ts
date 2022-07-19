import { app, dialog, ipcMain } from 'electron'
import { stat, mkdir } from 'fs'
import { join } from 'path'
import Store from 'electron-store'
import validateIpcSender from '../../lib/validateIpcSender'

const store = new Store()

/**
 * Initialize the recordings location from config file
 */
if (!store.has('recordings')) {
	const path = join(app.getPath('userData'), 'recordings')

	store.set('recordings', path)

	stat(path, (err) => {
		if (err) {
			mkdir(path, (err) => {
				if (!err) {
					throw new Error('Failed to create default recordings directory')
				}
			})
		}
	})
}

ipcMain.handle('getRecordingsDir', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return store.get('recordings')
})

ipcMain.handle('selectRecordingsDir', async (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	const { filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
		title: 'test',
	})

	return filePaths[0]
})

ipcMain.handle('updateRecordingsDir', (event, path) => {
	if (!validateIpcSender(event.senderFrame)) return

	if (!path) {
		return false
	}

	return new Promise((res) =>
		stat(path, (err, stats) => {
			// If directory doesn't exist it will contain an error
			if (err || !stats.isDirectory()) {
				return res(false)
			}

			// Update the recordings directory
			store.set('recordings', path)

			res(true)
		})
	)
})
