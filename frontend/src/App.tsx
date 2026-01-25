import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChampionshipDetailPage from './pages/ChampionshipDetailPage' // Import ChampionshipDetailPage


const router = createBrowserRouter([
	{
		path: '/', element: <HomePage />,
	},
	{
		path: '/championships/:slug', element: <ChampionshipDetailPage />, // New route
	},
	
	])

	export default function App() {
	return (
		<RouterProvider router={router} />
	)
}
