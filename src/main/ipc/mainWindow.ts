import { ipcMain, BrowserWindow } from 'electron'
import validateIpcSender from '../../lib/validateIpcSender'

ipcMain.handle('window:isMaximized', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	return BrowserWindow.getFocusedWindow()?.isMaximized()
})

ipcMain.on('window:maximize', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.maximize()
})

ipcMain.on('window:minimize', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.minimize()
})

ipcMain.on('window:restore', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.unmaximize()
})

ipcMain.once('window:close', (event) => {
	if (!validateIpcSender(event.senderFrame)) return

	BrowserWindow.getFocusedWindow()?.close()
})
