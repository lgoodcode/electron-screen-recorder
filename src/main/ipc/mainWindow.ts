import { ipcMain, BrowserWindow } from 'electron'
import validateIpcSender from '../../lib/validateIpcSender'

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
