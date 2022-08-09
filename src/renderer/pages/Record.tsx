import {
	Box,
	Button,
	Center,
	Divider,
	Flex,
	Heading,
	HStack,
	Icon,
	Spinner,
	useToast,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { MdOutlineOndemandVideo } from 'react-icons/md'
import { BsFillRecordFill, BsFillStopFill } from 'react-icons/bs'
import useRecorder from '../../lib/useRecorder'
import { AiOutlineStop } from 'react-icons/ai'

export default function Record() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const {
		loading,
		error,
		hasSource,
		recording,
		processing,
		startRecording,
		stopRecording,
		cancelRecording,
	} = useRecorder({
		videoRef,
	})
	const handleGetSources = () => window.videoStream.getVideoSources()
	const toast = useToast({
		position: 'top-right',
		isClosable: true,
		status: 'error',
		containerStyle: {
			transform: 'translateY(32px)',
		},
	})

	useEffect(() => {
		if (error) {
			toast({ description: error })
		}
	}, [error])

	return (
		<Flex className="record-page" h="full" pos="relative" flexDir="column" pb={4}>
			<Box className="heading">
				<Heading as="h1">Record</Heading>
				<Divider mt={2} />
			</Box>

			{(loading || !hasSource) && (
				<Center className="no-source" h="full">
					{!loading && !hasSource && (
						<Heading as="h2" size="md">
							Select a video source to record
						</Heading>
					)}

					{loading && hasSource && <Spinner size="xl" />}
				</Center>
			)}

			<Flex
				className="video-container"
				mt={8}
				h="full"
				minH="560px"
				align="center"
				justify="center"
				display={hasSource ? 'flex' : 'none'}
				style={{
					aspectRatio: '16 / 9',
				}}
			>
				<video ref={videoRef} style={{ height: '100%' }}></video>
			</Flex>

			<Flex className="video-buttons" mt={8} justifyContent="space-between">
				<Box>
					<Button disabled={recording || processing} onClick={handleGetSources}>
						<Icon as={MdOutlineOndemandVideo} mr={2} />
						Select Source
					</Button>
				</Box>

				{!recording ? (
					<Button
						bg="red.500"
						color="white"
						_hover={{ bg: 'red.600' }}
						_active={{ bg: 'red.700' }}
						disabled={!hasSource || recording || processing}
						onClick={startRecording}
					>
						<Icon as={BsFillRecordFill} mr={2} />
						Record
					</Button>
				) : (
					<HStack spacing={4}>
						<Button
							bg="yellow.500"
							color="white"
							_hover={{ bg: 'yellow.600' }}
							_active={{ bg: 'yellow.700' }}
							disabled={!hasSource || !recording || processing}
							onClick={cancelRecording}
						>
							<Icon as={AiOutlineStop} mr={2} />
							Cancel
						</Button>

						<Button
							bg="red.500"
							color="white"
							_hover={{ bg: 'red.600' }}
							_active={{ bg: 'red.700' }}
							disabled={!hasSource || !recording || processing}
							onClick={stopRecording}
						>
							<Icon as={BsFillStopFill} mr={2} />
							Stop
						</Button>
					</HStack>
				)}
			</Flex>
		</Flex>
	)
}
