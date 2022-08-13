import { contextBridge, ipcRenderer } from 'electron'

/**
 * Handles dealing with the video stream and passing it between the main and
 * renderer processes. Manages the current stream and the retrieving previously
 * saved recordings.
 */
const videoAPI = {
  getVideoSources: () => ipcRenderer.send('video:getSources'),
  // Specify the default handler type to satisfy the `on` handler but the
  // actual argument is going to be the id string of the selected video source.
  handleVideoSource: (handler: (id: string) => void) =>
    ipcRenderer.on('video:getSources', (_event, id: string) => handler(id)),

  processVideo: async (ab: ArrayBuffer) => await ipcRenderer.invoke<string>('video:process', ab),

  currentStream: {
    get: async () => await ipcRenderer.invoke<string>('video:stream::get'),
    set: (id: string) => ipcRenderer.send('video:stream::set', id),
    clear: () => ipcRenderer.send('video:stream::clear'),
  },

  getRecordings: async () => await ipcRenderer.invoke<string | Video[]>('video:getRecordings'),
}

contextBridge.exposeInMainWorld('video', videoAPI)

// When the app is about to close, clear the current stream saved so that the
// next time the app is opened, it won't attempt to load the stream.
ipcRenderer.on('will-quit', () => localStorage.removeItem('currentStreamId'))

export default videoAPI
