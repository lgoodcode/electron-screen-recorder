import { ipcRenderer } from './mocks/electronMock'
import settingsAPI from 'preload/settings'

describe('settingsAPI', () => {
  it('getRecordingsDir should return a string for the recordings directory', () => {
    const dir = 'C:\\recordings'
    ipcRenderer.invoke.mockResolvedValue(dir)
    expect(settingsAPI.getRecordingsDir()).resolves.toBe(dir)
  })

  it('selectRecordingsDir should return a string for the selected directory', () => {
    const dir = 'C:\\recordings'
    ipcRenderer.invoke.mockResolvedValue(dir)
    expect(settingsAPI.selectRecordingsDir()).resolves.toBe(dir)
  })

  it('updateRecordingsDir should return a boolean for whether the directory was updated', () => {
    const dir = 'C:\\recordings'
    ipcRenderer.invoke.mockResolvedValue(true)
    expect(settingsAPI.updateRecordingsDir(dir)).resolves.toBe(true)
  })
})
