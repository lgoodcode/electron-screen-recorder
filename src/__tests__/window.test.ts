import { ipcRenderer } from './mocks/electronMock'
import windowAPI from 'preload/window'

describe('windowAPI', () => {
	it('isMaximized should return a boolean for whether the window is maximized', () => {
		const isMaximized = false
		ipcRenderer.invoke.mockResolvedValue(isMaximized)
		expect(windowAPI.isMaximized()).resolves.toBe(isMaximized)
	})
})
