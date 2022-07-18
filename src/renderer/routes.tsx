import Record from './pages/Record'
import Recordings from './pages/Recordings'
import Settings from './pages/Settings'

export default [
	{
		path: '/record',
		element: <Record />,
	},
	{
		path: '/recordings',
		element: <Recordings />,
	},
	{
		path: '/settings',
		element: <Settings />,
	},
]
