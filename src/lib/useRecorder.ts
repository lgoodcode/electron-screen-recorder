import { useEffect, useState } from 'react'

const VIDEO_ENCODING = 'video/webm;codecs=vp9'

export type StreamConstraintsOptions = {
	minWidth?: number
	minHeight?: number
	maxWidth?: number
	maxHeight?: number
}

const getStreamConstraints = (id: string, options?: StreamConstraintsOptions) => ({
	audio: false,
	video: {
		mandatory: {
			chromeMediaSource: 'desktop',
			chromeMediaSourceId: id,
		},
		minWidth: 480,
		minHeight: 270,
		maxWidth: 1920,
		maxHeight: 1080,
		...options,
	},
})

const getStream = async (id: string, streamConstraints?: StreamConstraintsOptions) => {
	if (!id) return null
	// Need to set type to any because the chromeMediaSource properties
	// are not part of the standard.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return await (navigator.mediaDevices as any).getUserMedia(
		getStreamConstraints(id, streamConstraints)
	)
}

const getCurrentStreamId = () => localStorage.getItem('currentStreamId') || ''

const setCurrentStreamId = (id: string) => localStorage.setItem('currentStreamId', id)

const clearCurrentStreamId = () => localStorage.removeItem('currentStreamId')

export type useRecorderOptions = {
	videoRef?: React.RefObject<HTMLVideoElement>
	streamConstraints?: StreamConstraintsOptions
}

export default function useRecorder(options?: useRecorderOptions) {
	const { videoRef, streamConstraints } = options || {}
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [video, setVideo] = useState<HTMLVideoElement | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
	const [chunks, setChunks] = useState<Blob[]>([])
	const [hasSource, setHasSource] = useState(false)
	const [recording, setRecording] = useState(false)
	const [processing, setProcessing] = useState(false)
	const recorderOptions = { mimeType: VIDEO_ENCODING }

	const startRecording = () => {
		if (recorder) {
			recorder.start()
			setRecording(true)
			setError('')
		}
	}

	const stopRecording = () => {
		clearCurrentStreamId()

		if (recorder) {
			recorder.stop()
			setRecording(false)
			setProcessing(true)

			if (video) {
				video.pause()
			}
		}
	}

	const setVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
		video.srcObject = stream
		video.onloadeddata = () => video.play()

		setStream(stream)
		setHasSource(true)
	}

	/**
	 * Initialize video element state
	 *
	 * If a video element was passed in to be used, set it in state. Because React
	 * will re-render and execute this useEffect hook because the videoRef will
	 * change, we check if the video element is already set to not repeat it.
	 */
	useEffect(() => {
		if (videoRef && videoRef.current && !video) {
			setVideo(videoRef.current)
		}
	}, [videoRef?.current])

	/**
	 * Initialize the stream state and source selection handler
	 *
	 * Once the video element is set, we first check if there is a stream id in
	 * the localStorage and if so, we get the stream and set it to the video.
	 *
	 * Sets the handler to listen for when a video source is selected and to
	 * get the stream and set it to the video.
	 */
	useEffect(() => {
		if (video) {
			const currentStreamId = getCurrentStreamId()

			if (!currentStreamId) {
				setLoading(false)
			} else {
				getStream(currentStreamId, streamConstraints).then((stream) => {
					setLoading(false)
					setVideoStream(video, stream)
				})
			}

			// Once the main process has sent the video sources, get the stream
			// using the navigator, set the playback source, and create the recorder.
			window.videoStream.handleVideoSource(async (id: string) => {
				setCurrentStreamId(id)

				setVideoStream(video, await getStream(id, streamConstraints))
			})
		}
	}, [video])

	/**
	 * Handle the recording process
	 *
	 * Whenever a stream is set, by the user selecting a new source to record,
	 * we create and set a new recorder for that stream. We set the event
	 * listeners for the recorder on recording and when stopped.
	 */
	useEffect(() => {
		if (stream && video) {
			const newRecorder = new MediaRecorder(stream, recorderOptions)
			// When recording, add the chunks to the chunks array
			const handleRecording = (e: BlobEvent) => chunks.push(e.data)
			// When done recording, create a blob and send it to the main process
			const handleStop = async () => {
				const blob = new Blob(chunks, { type: VIDEO_ENCODING })
				// Done recording; remove stream, clear source flag, and reset chunks
				setStream(null)
				setHasSource(false)
				setChunks([])
				// Process video
				const result = await window.videoStream.processVideo(await blob.arrayBuffer())
				// Reset the video source
				video.srcObject = null
				// Completed video processing
				setProcessing(false)
				// If there was an error, set it in state
				if (result === 'failed') {
					setError('Failed to save video')
				}
			}

			newRecorder.addEventListener('dataavailable', handleRecording)
			newRecorder.addEventListener('stop', handleStop)

			setRecorder(newRecorder)

			return () => {
				newRecorder.removeEventListener('dataavailable', handleRecording)
				newRecorder.removeEventListener('stop', handleStop)
			}
		}
	}, [stream])

	return {
		loading,
		error,
		hasSource,
		recording,
		processing,
		setVideo,
		startRecording,
		stopRecording,
	}
}
