import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TitleBar from './TitleBar'

export default function Layout() {
	const [collapsed, _setCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true')
	const setCollapsed = (collapsed: boolean) => {
		_setCollapsed(!collapsed)
		localStorage.setItem('sidebarCollapsed', String(!collapsed))
	}

	return (
		<>
			<TitleBar />
			<Flex
				className="wrapper"
				flexDir="row"
				h="100vh"
				pt="32px"
				overflow="hidden"
				bg={useColorModeValue('white', 'gray.700')}
			>
				<Sidebar {...{ collapsed, setCollapsed }} />
				<Box
					className="main"
					as="main"
					py={4}
					px={8}
					w={`calc(100% - ${collapsed ? '4.5rem' : '300px'})`}
					transition="width 0.5s ease"
				>
					<Outlet />
				</Box>
			</Flex>
		</>
	)
}
