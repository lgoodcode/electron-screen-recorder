import { Box, Center, Grid, Icon, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
	VscChromeClose,
	VscChromeMaximize,
	VscChromeMinimize,
	VscChromeRestore,
} from 'react-icons/vsc'
import '../styles/titlebar.css'

export default function TitleBar() {
	const [maximized, setMaximized] = useState(false)
	const handleMaximize = () => {
		window.mainWindow.maximize()
		setMaximized(true)
	}
	const handleMinimize = () => window.mainWindow.minimize()
	const handleRestore = () => {
		window.mainWindow.restore()
		setMaximized(false)
	}
	const handleClose = () => window.mainWindow.close()

	/**
	 * Get the initial state of the window if it's maximized on inital render
	 */
	useEffect(() => {
		window.mainWindow.isMaximized().then(setMaximized)
	}, [])

	return (
		<Box
			as="header"
			id="titlebar"
			h="32px"
			w="full"
			pos="fixed"
			bg="gray.900"
			color="white"
			zIndex={10}
		>
			<Box id="drag-region" w="full" h="full">
				{/* <Box pos="absolute" top={0} left={0} h={'32px'} w={'32px'}>
					<Image src={icon} />
				</Box> */}

				<Grid
					id="window-controls"
					templateColumns="repeat(3, 46px)"
					pos="absolute"
					h="full"
					top={0}
					right={0}
					textAlign="center"
				>
					<Tooltip openDelay={500} label="Minimize">
						<Center
							className="win-ctrl-btn"
							id="minimize"
							onClick={handleMinimize}
							_hover={{
								cursor: 'pointer',
								bg: 'gray.700',
							}}
						>
							<Icon as={VscChromeMinimize} />
						</Center>
					</Tooltip>

					{!maximized && (
						<Tooltip openDelay={500} label="Maximize">
							<Center
								className="win-ctrl-btn"
								id="maximize"
								onClick={handleMaximize}
								_hover={{
									cursor: 'pointer',
									bg: 'gray.700',
								}}
							>
								<Icon as={VscChromeMaximize} />
							</Center>
						</Tooltip>
					)}

					{maximized && (
						<Tooltip openDelay={500} label="Restore Down">
							<Center
								className="win-ctrl-btn"
								id="restore"
								onClick={handleRestore}
								_hover={{
									cursor: 'pointer',
									bg: 'gray.700',
								}}
							>
								<Icon as={VscChromeRestore} />
							</Center>
						</Tooltip>
					)}

					<Tooltip openDelay={500} label="Close">
						<Center
							className="win-ctrl-btn"
							id="close"
							onClick={handleClose}
							_hover={{
								cursor: 'pointer',
								bg: 'red.500',
							}}
						>
							<Icon as={VscChromeClose} />
						</Center>
					</Tooltip>
				</Grid>
			</Box>
		</Box>
	)
}
