import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import 'bulma/css/bulma.min.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)

window.electron.ipcRenderer.once('ipc-example', (arg) => {
	console.log('[Channel] ipc-example: ', arg)
})
window.electron.ipcRenderer.send('ipc-example', ['ping'])
