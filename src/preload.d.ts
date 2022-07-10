/* eslint-disable @typescript-eslint/no-explicit-any */

export type Channels = 'getVideoSources' | 'processVideo' | 'isMaximized'

declare global {
	interface Window {
		ipcRenderer: {
			send(channel: Channels, args?: unknown[]): void
			on(channel: Channels, listener: (...args: unknown[]) => void): (() => void) | undefined
			once(channel: Channels, listener: (...args: unknown[]) => void): void
			off(channel: Channels): void
		}

		processVideo(ab: ArrayBuffer): void

		mainWindow: {
			isMaximized(): Promise<boolean>
			minimize(): void
			maximize(): void
			restore(): void
			close(): void
		}
	}

	namespace Electron {
		interface IpcMain {
			on(channel: Channels, listener: (event: IpcMainEvent, ...args: any[]) => void): this
			once(channel: Channels, listener: (...args: unknown[]) => void): void
			handle(channel: Channels, listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this
		}
	}
}
