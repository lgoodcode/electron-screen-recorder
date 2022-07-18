import { Box, Divider, Flex, Icon, Image, Text, useColorModeValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineArrowLeft, AiOutlineVideoCamera, AiOutlineFolderOpen } from 'react-icons/ai'
import { BiCog } from 'react-icons/bi'
import SidebarItem, { type SidebarItemProps } from './SidebarItem'
import logo from '../assets/icon.svg'

type SidebarProps = {
	collapsed: boolean
	setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
	const navigate = useNavigate()
	const navItems: Omit<SidebarItemProps, 'collapsed'>[] = [
		{
			name: 'New Recording',
			icon: AiOutlineVideoCamera,
			onClick: () => navigate('/record'),
		},
		{
			name: 'View Recordings',
			icon: AiOutlineFolderOpen,
			onClick: () => navigate('/recordings'),
		},
	]

	return (
		<Flex
			className={`sidebar ${collapsed ? 'collapsed' : ''}`}
			bg={useColorModeValue('gray.200', 'gray.800')}
			pos="relative"
			h="full"
			w={collapsed ? '5rem' : '300px'}
			p={4}
			transition="all 0.5s ease"
			flexDir="column"
			justifyContent="space-between"
		>
			<Flex
				className="sidebar-header"
				h="40px"
				w="full"
				align="center"
				justify="space-between"
				pos="absolute"
			>
				<Flex
					className="logo-wrapper"
					align="center"
					opacity={collapsed ? 0 : 1}
					transition="all 0.3s ease"
					pointerEvents={collapsed ? 'none' : 'auto'}
				>
					<Box className="logo" mr="1rem" h={10} w={10} pos="relative">
						<Image src={logo} bg={useColorModeValue('gray.900', 'transparent')} />
					</Box>

					<Text className="logo-name" whiteSpace="nowrap">
						Screen Recorder
					</Text>
				</Flex>

				<Box className="sidebar-button" pos="absolute" right={8}>
					<Flex
						aria-label="Collapse sidebar"
						onClick={() => setCollapsed(collapsed)}
						p={3}
						bg="transparent"
						border="1px solid"
						borderRadius="md"
						cursor="pointer"
						color={useColorModeValue('gray.600', 'whiteAlpha.800')}
						borderColor={useColorModeValue('gray.500', 'gray.600')}
						transform={collapsed ? 'rotate(180deg)' : 'rotate(0deg)'}
						transition="all 0.5s ease"
						_hover={{
							bg: useColorModeValue('gray.300', 'gray.700'),
							color: useColorModeValue('gray.700', 'whiteAlpha.900'),
						}}
						_active={{
							bg: useColorModeValue('gray.400', 'gray.600'),
						}}
					>
						<Icon as={AiOutlineArrowLeft} h={5} w={5} />
					</Flex>
				</Box>
			</Flex>

			<Box className="sidebar-body" top="40px" pos="relative">
				<Box mt={8}>
					{navItems.map((props) => (
						<SidebarItem {...{ ...props, collapsed }} />
					))}
				</Box>
			</Box>

			<Box className="sidebar-footer">
				<Divider />
				<SidebarItem
					name="Settings"
					icon={BiCog}
					onClick={() => navigate('/settings')}
					collapsed={collapsed}
				/>
			</Box>
		</Flex>
	)
}
