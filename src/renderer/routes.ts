import { AiOutlineVideoCamera, AiOutlineFolderOpen } from 'react-icons/ai'
import { BiCog } from 'react-icons/bi'
import Record from './pages/Record'
import Recordings from './pages/Recordings'
import Settings from './pages/Settings'

export default [
	{
		name: 'New Recording',
		path: '/',
		Element: Record,
		icon: AiOutlineVideoCamera,
	},
	{
		name: 'View Recordings',
		path: '/recordings',
		Element: Recordings,
		icon: AiOutlineFolderOpen,
	},
	{
		name: 'Settings',
		path: '/settings',
		Element: Settings,
		icon: BiCog,
	},
]
