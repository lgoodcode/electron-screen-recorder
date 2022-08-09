import {
	Box,
	Center,
	Divider,
	Flex,
	Heading,
	Spinner,
	useColorModeValue,
	useDisclosure,
	VStack,
	useToast,
	IconButton,
	Icon,
	Tooltip,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export default function Recordings() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [loading, setLoading] = useState(false)
	const [recordings, setRecordings] = useState<Video[]>([])
	const [selected, setSelected] = useState('')
	const { isOpen, onOpen, onClose } = useDisclosure()
	const toast = useToast({
		position: 'top-right',
		isClosable: true,
		status: 'error',
		containerStyle: {
			transform: 'translateY(32px)',
		},
	})

	/**
	 * - Set the name of the recording selected to view
	 * - Open the modal
	 * - Set the video source of the video in the modal to the selected recording
	 *   by creating an object URL of a Blob using the buffer of the recording.
	 */
	const handleViewRecording = (recording: Video) => () => {
		setSelected(recording.name)
		onOpen()

		if (videoRef.current) {
			videoRef.current.src = URL.createObjectURL(
				new Blob([recording.buffer], { type: 'video/mp4' })
			)
		}
	}

	/**
	 * On page load, retrieve the recordings stored in the configuration. When
	 * done, set the loading state to false. If there was an error, it will have
	 * returned a string containing the error message and will show a toast.
	 * Otherwise, it will set the recordings state to the retrieved recordings.
	 */
	useEffect(() => {
		window.videoStream.getRecordings().then((recordings) => {
			setLoading(false)

			if (typeof recordings === 'string') {
				toast({ description: recordings })
			} else {
				setRecordings(recordings)
			}
		})
	}, [])

	return (
		<Flex className="recordings-page" h="full" pos="relative" flexDir="column" pb={4}>
			<Box className="heading">
				<Heading as="h1">Recordings</Heading>
				<Divider mt={2} />
			</Box>

			{(loading || !recordings.length) && (
				<Center className="no-recordings" h="full">
					{!loading && !recordings.length && (
						<Heading as="h2" size="md">
							No recordings found
						</Heading>
					)}

					{loading && <Spinner size="xl" />}
				</Center>
			)}

			<VStack
				className="recordings"
				mt={8}
				px={4}
				spacing={4}
				display={recordings.length ? 'flex' : 'none'}
				overflowY="auto"
			>
				{recordings.map((video) => (
					<Box
						key={video.name}
						className="recording-item"
						w="full"
						p={4}
						bg={useColorModeValue('gray.100', 'gray.800')}
						cursor="pointer"
						borderRadius="md"
						onClick={handleViewRecording(video)}
						_hover={{
							bg: useColorModeValue('gray.200', 'gray.900'),
						}}
						_active={{
							bg: useColorModeValue('gray.300', 'gray.800'),
						}}
					>
						{video.name}
					</Box>
				))}
			</VStack>

			<Box
				className="modal"
				pos="fixed"
				w="100vw"
				h="calc(100vh - 32px)"
				top="32px"
				left={0}
				opacity={isOpen ? 1 : 0}
				zIndex={isOpen ? 1000 : -1}
				transition="all 0.3s ease"
			>
				<Box
					className="modal-overlay"
					pos="fixed"
					w="full"
					h="full"
					bg="blackAlpha.600"
					onClick={onClose}
				/>
				<Flex className="modal-container" h="full" w="full" align="center" justify="center">
					<Box
						className="modal-content"
						minW="600px"
						maxW="50%"
						maxH="90vh"
						w="auto"
						bg={useColorModeValue('white', 'gray.700')}
						borderRadius="md"
						zIndex={1001}
						transform={isOpen ? 'translateY(0)' : 'translateY(100px)'}
						transition="all 0.3s ease"
					>
						<Flex className="modal-header" px={6} py={4} align="center" justify="space-between">
							<Heading as="h2" size="md">
								{selected}
							</Heading>

							<Tooltip label="Close" openDelay={300}>
								<IconButton
									size="sm"
									icon={<Icon as={AiOutlineClose} />}
									aria-label="Close Modal"
									onClick={onClose}
								/>
							</Tooltip>
						</Flex>
						<Box className="modal-body" px={6} py={4}>
							<Flex
								className="video-container"
								h="full"
								pos="relative"
								flexDir="column"
								align="center"
								justify="center"
								style={{ aspectRatio: '16 / 9' }}
							>
								<video
									ref={videoRef}
									controls
									controlsList="nodownload"
									style={{
										width: '100%',
										maxHeight: '80vh',
									}}
								></video>
							</Flex>
						</Box>
					</Box>
				</Flex>
			</Box>
		</Flex>
	)
}
