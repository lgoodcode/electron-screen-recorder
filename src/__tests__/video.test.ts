import { ipcRenderer } from './mocks/electronMock'
import videoApi from 'preload/video'

describe('videoAPI', () => {
	it('getVideoSources should emit an event for the video sources', () => {
		videoApi.getVideoSources()
		expect(ipcRenderer.send).toHaveBeenCalledWith('video:getSources')
	})

	it('handleVideoSource should register a handler for the video sources', () => {
		const handler = jest.fn()
		videoApi.handleVideoSource(handler)
		expect(ipcRenderer.on).toHaveBeenCalledWith('video:getSources', expect.any(Function))
	})

	it('processVideo should invoke the video:process event', () => {
		const ab = new ArrayBuffer(0)
		const result = videoApi.processVideo(ab)

		expect(ipcRenderer.invoke).toHaveBeenCalledWith('video:process', ab)
		expect(result).toBeInstanceOf(Promise<string>)
	})
})
