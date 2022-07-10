import { Colors, extendTheme, ThemeComponents, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}

const styles = {
	global: {
		color: mode('gray.800', 'whiteAlpha.900'),
		bg: mode('white', 'gray.700'),
	},
}

const components: ThemeComponents = {
	Heading: {
		baseStyle: {
			fontWeight: 500,
		},
	},
	Divider: {
		baseStyle: {
			borderBottomColor: 'gray !important',
		},
	},
	Button: {
		variants: {
			primarySolid: {
				color: 'white',
				bg: 'primary.500',
				_hover: {
					bg: 'primary.600',
				},
			},
			primaryOutline: {
				bg: 'whiteAlpha.100',
				border: '1px solid',
				borderColor: 'whiteAlpha.700',
				_hover: {
					bg: 'whiteAlpha.300',
				},
			},
			secondarySolid: {
				color: 'white',
				bg: 'secondary.500',
				_hover: {
					bg: 'secondary.600',
				},
			},
		},
	},
}

const colors: Colors = {
	primary: {
		50: '#f4eefd',
		100: '#dad0e3',
		200: '#bfb2cd',
		300: '#a594b8',
		400: '#8c75a2',
		500: '#725c89',
		600: '#59476b',
		700: '#3f334e',
		800: '#271e30',
		900: '#100815',
	},
	secondary: {
		50: '#f3f6e5',
		100: '#dfe3ca',
		200: '#c9cfae',
		300: '#b3bc8f',
		400: '#9ea870',
		500: '#848f57',
		600: '#676f42',
		700: '#494f2e',
		800: '#2b3019',
		900: '#0e1100',
	},
}

export default extendTheme({
	config,
	styles,
	components,
	colors,
	fonts: {
		body: 'Inter, -apple-system, system-ui, sans-serif',
		heading: 'Inter, -apple-system, system-ui, sans-serif',
	},
})
