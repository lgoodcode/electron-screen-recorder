import { app, desktopCapturer, dialog, ipcMain, Menu } from 'electron'
import { writeFile } from 'fs'
import { join } from 'path'
import store from './store'
import validateIpcSender from '../../lib/validateIpcSender'

/**
 * Handles the `getVideoSources` message from the renderer process.
 * Return an id string of the selected video source.
 */
ipcMain.on('getVideoSources', async (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	const sources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	})

	const videoOptionsMenu = Menu.buildFromTemplate(
		sources.map((source) => ({
			label: source.name,
			click: () => event.reply('getVideoSources', source.id),
		}))
	)
	// Display options
	videoOptionsMenu.popup()
})

/**
 * Used to listen to for when receiving a video with the ArrayBuffer of the
 * stream from the renderer process, prompt where to save the video.
 */
ipcMain.handle('processVideo', async (event, ab) => {
	if (!validateIpcSender(event.senderFrame)) return

	if (!ab) {
		throw new Error('[Recording] No video stream received')
	}

	const buffer = Buffer.from(ab)
	const { filePath } = await dialog.showSaveDialog({
		title: 'Save video',
		buttonLabel: 'Save video',
		defaultPath: join(store.get('recordingsDir'), `recording-${Date.now()}.webm`),
	})

	if (!filePath) return 'cancelled'

	return new Promise<string>((res) => {
		writeFile(filePath, buffer, (err) => {
			if (err) return res('failed')
			return res('success')
		})
	})
})

ipcMain.handle('getCurrentStream', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return store.get('currentStream', '')
})

ipcMain.on('setCurrentStream', (event, id) => {
	if (!validateIpcSender(event.senderFrame)) return

	store.set('currentStream', id)
})

ipcMain.on('clearCurrentStream', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	store.delete('currentStream')
})

app.on('before-quit', () => {
	store.delete('currentStream')
})
