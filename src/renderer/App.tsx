import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from './components/Layout'
import routes from './routes'
import theme from './styles/theme'

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map((route) => (
              <Route path={route.path} element={<route.Element />} key={route.path} />
            ))}
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  )
}
