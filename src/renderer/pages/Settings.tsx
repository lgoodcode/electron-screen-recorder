import { Box, Divider, Heading, HStack, Radio, RadioGroup, useColorMode } from '@chakra-ui/react'

export default function Settings() {
	const { colorMode, setColorMode } = useColorMode()

	return (
		<>
			<Box>
				<Heading as="h1">Settings</Heading>
				<Divider mt={2} />
			</Box>

			<Box mt={8}>
				<Heading as="h2" size="lg">
					Dark Mode
				</Heading>

				<RadioGroup mt={4} defaultValue={colorMode} onChange={setColorMode}>
					<HStack spacing={4}>
						<Radio size="lg" value="dark" defaultChecked>
							Dark
						</Radio>
						<Radio size="lg" value="light">
							Light
						</Radio>
					</HStack>
				</RadioGroup>
			</Box>
		</>
	)
}
