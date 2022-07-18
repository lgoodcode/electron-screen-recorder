import { ipcMain, desktopCapturer, Menu, dialog, BrowserWindow } from 'electron'
import validateIpcSender from '../lib/validateIpcSender'
import { writeFile } from 'fs'

/**
 * Inter-process communication
 *
 * Used to communicate between the renderer process and the main process
 *
 * It is recommended to use `reply` to send a response to the renderer process
 * to ensure that it is sent to the proper sender.
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
ipcMain.on('processVideo', async (event, ab) => {
	if (!validateIpcSender(event.senderFrame)) return

	const buffer = Buffer.from(ab)

	const { filePath } = await dialog.showSaveDialog({
		buttonLabel: 'Save video',
		defaultPath: `recording-${Date.now()}.webm`,
	})

	if (filePath) {
		writeFile(filePath, buffer, () => event.reply('processVideo'))
	} else {
		event.reply('processVideo', 'No path seletected. Aborted saving video.')
	}
})

/**
 * mainWindow API
 */
ipcMain.handle('isMaximized', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return BrowserWindow.getFocusedWindow()?.isMaximized()
})

ipcMain.on('maximize', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.maximize()
})

ipcMain.on('minimize', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.minimize()
})

ipcMain.on('restore', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.unmaximize()
})

ipcMain.once('close', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.close()
})
