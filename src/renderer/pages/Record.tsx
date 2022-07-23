import { Box, Button, Divider, Flex, Heading, Icon, useToast } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { MdOutlineOndemandVideo } from 'react-icons/md'
import { BsFillRecordFill, BsFillStopFill } from 'react-icons/bs'
import useRecorder from '../../lib/useRecorder'

export default function Record() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const { loading, error, hasSource, recording, processing, startRecording, stopRecording } =
		useRecorder({
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

			<Flex className="video-container" h="full" align="center" justify="center">
				{!loading && !hasSource && (
					<Heading as="h2" size="md">
						Select a video source to record
					</Heading>
				)}

				<video
					ref={videoRef}
					style={{
						width: '100%',
						height: '600px',
						display: !hasSource ? 'none' : 'block',
					}}
				></video>
			</Flex>

			<Flex className="video-buttons" justifyContent="space-between">
				<Box>
					<Button disabled={recording || processing} onClick={handleGetSources}>
						<Icon as={MdOutlineOndemandVideo} mr={2} />
						Select Source
					</Button>
				</Box>

				{!recording ? (
					<Button
						bg="red.500"
						_hover={{ bg: 'red.600' }}
						_active={{ bg: 'red.700' }}
						disabled={!hasSource || recording || processing}
						onClick={startRecording}
					>
						<Icon as={BsFillRecordFill} mr={2} />
						Record
					</Button>
				) : (
					<Button
						bg="yellow.500"
						_hover={{ bg: 'yellow.600' }}
						_active={{ bg: 'yellow.700' }}
						disabled={!hasSource || !recording || processing}
						onClick={stopRecording}
					>
						<Icon as={BsFillStopFill} mr={2} />
						Stop
					</Button>
				)}
			</Flex>
		</Flex>
	)
}
