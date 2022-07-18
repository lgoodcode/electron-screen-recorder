import { Box, Button, Divider, Flex, Heading } from '@chakra-ui/react'

export default function Record() {
	return (
		<>
			<Box>
				<Heading as="h1">Record</Heading>
				<Divider mt={2} />
			</Box>

			<Flex pos="absolute" bottom={8} justifyContent="center">
				<Button>Select Source</Button>
			</Flex>
		</>
	)
}
