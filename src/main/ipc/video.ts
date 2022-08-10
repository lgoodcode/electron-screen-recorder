import { app, desktopCapturer, dialog, ipcMain, Menu } from 'electron'
import { readdir, readFile, writeFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import store from './store'
import validateIpcSender from '../../lib/validateIpcSender'

const timestamp = () =>
	new Date()
		.toLocaleString('en-us', { hour12: false })
		.replace(/\//g, '_')
		.replace(', ', '_')
		.replace(/:/g, '_')

/**
 * Handles the `video:getSources` message from the renderer process.
 * Return an id string of the selected video source.
 */
ipcMain.on('video:getSources', async (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	const sources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	})

	const videoOptionsMenu = Menu.buildFromTemplate(
		sources.map((source) => ({
			label: source.name,
			click: () => event.reply('video:getSources', source.id),
		}))
	)
	// Display options
	videoOptionsMenu.popup()
})

/**
 * Used to listen to for when receiving a video with the ArrayBuffer of the
 * stream from the renderer process, prompt where to save the video.
 */
ipcMain.handle('video:process', async (event, ab) => {
	if (!validateIpcSender(event.senderFrame)) return

	if (!ab) {
		throw new Error('[Recording] No video stream received')
	}

	const buffer: Buffer = Buffer.from(ab)
	const { filePath } = await dialog.showSaveDialog({
		title: 'Save video',
		buttonLabel: 'Save video',
		defaultPath: join(store.get('recordingsDir'), `recording-${timestamp()}.webm`),
	})

	if (!filePath) return 'cancelled'

	return promisify(writeFile)(filePath, buffer)
		.then(() => 'success')
		.catch((err) => {
			console.error(err)
			return 'failed'
		})
})

ipcMain.handle('video:stream::get', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return store.get('currentStream', '')
})

ipcMain.on('video:stream::set', (event, id) => {
	if (!validateIpcSender(event.senderFrame)) return

	store.set('currentStream', id)
})

ipcMain.on('vidoe:stream::clear', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	store.delete('currentStream')
})

/**
 * Clear the current stream on app launch to prevent attempting to load an id
 * that can't be found.
 */
app.on('ready', () => {
	store.delete('currentStream')
})

app.on('before-quit', () => {
	store.delete('currentStream')
})

ipcMain.handle('video:getRecordings', async (event) => {
	if (!validateIpcSender(event.senderFrame)) return 'Failed to get recordings'

	return new Promise<Video[] | string>((resVideos) => {
		readdir(store.get('recordingsDir'), async (err, files) => {
			if (err) {
				console.error(err)
				resVideos(err.message)
			}

			const videos: Video[] = []

			for (const file of files) {
				if (!file.endsWith('.webm')) continue

				const buffer = await promisify(readFile)(join(store.get('recordingsDir'), file)).catch(
					(err: NodeJS.ErrnoException) => err
				)

				if (buffer instanceof Error) {
					console.error(buffer)
					resVideos(buffer.message)
					return
				}

				videos.push({
					name: file,
					buffer,
				})
			}

			resVideos(videos)
		})
	})
})
