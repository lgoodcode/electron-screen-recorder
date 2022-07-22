import { ipcMain, desktopCapturer, Menu, dialog } from 'electron'
import { writeFile } from 'fs'
import { join } from 'path'
import Store from 'electron-store'
import validateIpcSender from '../../lib/validateIpcSender'

const store = new Store()

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
	const recordingsDir = store.get('recordingsDir') as string
	const { filePath } = await dialog.showSaveDialog({
		title: 'Save video',
		buttonLabel: 'Save video',
		defaultPath: join(recordingsDir, `recording-${Date.now()}.webm`),
	})

	if (!filePath) return 'cancelled'

	return new Promise<string>((res) => {
		writeFile(filePath, buffer, (err) => {
			if (err) return res('failed')
			return res('success')
		})
	})
})
