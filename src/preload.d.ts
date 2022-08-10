/* eslint-disable @typescript-eslint/no-explicit-any */

export type VideoStreamChannels =
	| 'video:getSources'
	| 'video:process'
	| 'video:stream::get'
	| 'video:stream::set'
	| 'video:stream::clear'
	| 'video:getRecordings'

export type SettingsChannels =
	| 'settings:recDir::get'
	| 'settings:recDir::select'
	| 'settings:recDir::update'

export type MainWindowChannels = 'window:isMaximized'

export type Channels = VideoStreamChannels | SettingsChannels | MainWindowChannels

declare global {
	type Video = {
		name: string
		buffer: ArrayBufferLike
	}

	interface Window {
		ipcRenderer: {
			send(channel: Channels, ...args: any[]): void
			on(channel: Channels, listener: (...args: any[]) => void): (() => void) | undefined
			once(channel: Channels, listener: (...args: any[]) => void): void
			invoke<T = any>(channel: Channels, ...args: any[]): Promise<T>
		}

		videoStream: {
			getVideoSources(): void
			/**
			 * The selected video source id is passed as the argument to the
			 * specified handler function to get the stream.
			 *
			 * @param handler the function to handle the selected video source id
			 */
			handleVideoSource(handler: (id: string) => void): void
			/**
			 * Passed the ArrayBuffer of the video stream to the main process where
			 * the user will be prompted to save the video file.
			 *
			 * @param ab the ArrayBuffer of the video stream
			 * @returns `canceled` if the user canceled the save dialog, `failed` if
			 * an error occurred while saving the video file, or `succeess` if the
			 * video file was saved successfully.
			 */
			processVideo(ab: ArrayBuffer): Promise<'cancelled' | 'failed' | 'success'>

			currentStream: {
				get(): Promise<string>
				set(id: string): void
				clear(): void
			}
			/**
			 * Retrieves the list of previously saved recordings. Reads the directory
			 * configured in the settings for the location of the recordings. It then
			 * iterates through each file and reads it, returning an array of `Video`
			 * objects.
			 *
			 * If an error occurs while attempting to read the directory or
			 * any of the files, it will return a string containing the error message.
			 */
			getRecordings(): Promise<Video[] | string>
		}

		settings: {
			getRecordingsDir(): Promise<string>
			selectRecordingsDir(): Promise<string>
			updateRecordingsDir(path: string): Promise<boolean>
		}

		mainWindow: {
			isMaximized(): Promise<boolean>
			minimize(): void
			maximize(): void
			restore(): void
			close(): void
		}
	}

	/**
	 * Override the default IpcMain type to allow intellisense for the channels.
	 */
	namespace Electron {
		interface IpcMain {
			on(channel: Channels, listener: (event: IpcMainEvent, ...args: any[]) => void): this
			once(channel: Channels, listener: (...args: any[]) => void): void
			handle(channel: Channels, listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this
		}

		interface IpcRenderer {
			invoke<T = any>(channel: Channels, ...args: any[]): Promise<T>
			send(channel: Channels, ...args: any[]): void
			on(channel: Channels, listener: (event: IpcMainEvent, ...args: any[]) => void): this
		}
	}
}
