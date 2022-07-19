import { useColorModeValue, Icon, useColorMode, Box, Text } from '@chakra-ui/react'
import type { IconType } from 'react-icons'

export type SidebarItemProps = {
	name: string
	icon: IconType
	onClick: () => void
	collapsed: boolean
}

export default function SidebarItem({ name, icon, onClick, collapsed }: SidebarItemProps) {
	const { colorMode } = useColorMode()

	return (
		<Box
			key={name}
			className="sidebar-item"
			borderRadius="md"
			p={3}
			mt={4}
			display="flex"
			position="relative"
			alignItems="center"
			color={useColorModeValue('gray.600', 'whiteAlpha.700')}
			transition="all 0.3s ease"
			whiteSpace="nowrap"
			cursor="pointer"
			bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
			onClick={onClick}
			userSelect="none"
			_before={{
				opacity: 0,
				position: 'absolute',
				content: '""',
				transition: 'all 0.3s ease',
				borderLeft: '4px solid',
				borderLeftColor: useColorModeValue('gray.800', 'whiteAlpha.900'),
				borderRadius: '2px',
				left: '-1rem',
				height: '100%',
				visibility: 'hidden',
			}}
			_hover={{
				bg: useColorModeValue('gray.300', 'gray.700'),
				color: useColorModeValue('gray.700', 'whiteAlpha.900'),
				transition: 'all 0.3s ease',
				_before: {
					opacity: 1,
					visibility: 'unset',
				},
			}}
			_active={{
				bg: useColorModeValue('gray.400', 'gray.600'),
			}}
		>
			<Icon as={icon} h={6} w={6} mr={4} />
			<Text as="span" opacity={collapsed ? 0 : 1} transition="opacity 0.3s ease">
				{name}
			</Text>
		</Box>
	)
}
