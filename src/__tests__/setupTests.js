// Used for testing front-end components
import '@testing-library/jest-dom'

/**
 * Need to mock the electron module for calls because it isn't initalized during
 * the tests and will return `undefined` otherwise
 */
jest.mock('electron', () => ({
	contextBridge: {
		exposeInMainWorld: jest.fn(),
	},
	ipcMain: {
		on: jest.fn(),
		handle: jest.fn(),
	},
	ipcRenderer: {
		invoke: jest.fn(),
		on: jest.fn(),
		once: jest.fn(),
		send: jest.fn(),
	},
}))

/**
 * Need to define the property because it will throw an error that 'mediaDevices'
 * is undefined
 */
// Object.defineProperty(global.navigator, 'mediaDevices', {
// 	value: {
// 		getUserMedia: jest.fn(async () => Promise.resolve),
// 	},
// })

/**
 * Preload API
 *
 * Need to define mock functions for all the API
 */
// global.mainWindow = {
// 	isMaximized: jest.fn(async () => Promise.resolve),
// 	minimize: jest.fn(),
// 	maximize: jest.fn(),
// 	restore: jest.fn(),
// 	close: jest.fn(),
// }

// global.settings = {
// 	getRecordingsDir: jest.fn(() => Promise.resolve('dir')),
// 	selectRecordingsDir: jest.fn(() => Promise.resolve('dir')),
// 	updateRecordingsDir: jest.fn(() => Promise.resolve(false)),
// }

// global.videoStream = {
// 	getVideoSources: () => jest.fn(),
// 	handleVideoSource: jest.fn(),
// 	processVideo: jest.fn(() => Promise.resolve(true)),
// 	currentStream: {
// 		get: jest.fn(() => Promise.resolve('id')),
// 		set: jest.fn(),
// 		clear: jest.fn(),
// 	},
// 	getRecordings: jest.fn(() => Promise.resolve([])),
// }
