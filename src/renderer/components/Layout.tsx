import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import TitleBar from './TitleBar'

export default function Layout() {
	return (
		<>
			<TitleBar />
			<Box as="main" h="100vh" bg="gray.700">
				<Outlet />
			</Box>
		</>
	)
}
