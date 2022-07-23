import { Box, Divider, Flex, Heading } from '@chakra-ui/react'

export default function Recordings() {
	return (
		<Flex className="recordings-page" h="full" pos="relative" flexDir="column" pb={4}>
			<Box className="heading">
				<Heading as="h1">Recordings</Heading>
				<Divider mt={2} />
			</Box>
		</Flex>
	)
}
