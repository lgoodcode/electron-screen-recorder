import { Icon, Text, Tooltip, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react'
import type { IconType } from 'react-icons'

export type SidebarItemProps = {
	name: string
	icon: IconType
	onClick: () => void
	collapsed: boolean
	active: boolean
}

export default function SidebarItem({ name, icon, onClick, collapsed, active }: SidebarItemProps) {
	const { colorMode } = useColorMode()

	return (
		<Tooltip isDisabled={!collapsed} label={name} placement="right" left={4}>
			<Flex
				key={name}
				className="sidebar-item"
				borderRadius="md"
				p={3}
				mt={4}
				position="relative"
				align="center"
				color={useColorModeValue('gray.600', 'whiteAlpha.700')}
				transition="all 0.3s ease"
				whiteSpace="nowrap"
				cursor="pointer"
				bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
				onClick={onClick}
				userSelect="none"
				_before={{
					opacity: active ? 1 : 0,
					position: 'absolute',
					content: '""',
					transition: 'all 0.3s ease',
					borderRight: '4px solid',
					borderRightColor: useColorModeValue('gray.600', 'whiteAlpha.700'),
					borderRadius: '2px',
					right: '-1rem',
					height: '100%',
					visibility: active ? 'visible' : 'hidden',
				}}
				_hover={{
					bg: useColorModeValue('gray.300', 'gray.700'),
					color: useColorModeValue('gray.700', 'whiteAlpha.900'),
					transition: 'all 0.3s ease',
					_before: {
						opacity: 1,
						visibility: 'unset',
						borderRightColor: useColorModeValue('gray.800', 'whiteAlpha.900'),
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
			</Flex>
		</Tooltip>
	)
}
