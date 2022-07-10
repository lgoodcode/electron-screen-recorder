import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from './components/Layout'
import Main from './components/Main'
import theme from './styles/theme'

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<Router>
				<Routes>
					<Route path="/" element={<Layout />}>
						{/* <Route path="/" element={<Main />} /> */}
					</Route>
				</Routes>
			</Router>
		</ChakraProvider>
	)
}
