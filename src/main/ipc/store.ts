import Store from 'electron-store'

export type StoreType = {
	recordingsDir: string
	currentStream: string
}

export default new Store<StoreType>()
