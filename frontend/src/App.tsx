import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChampionshipDetailPage from './pages/ChampionshipDetailPage' // Import ChampionshipDetailPage
import EventDetailPage from './pages/EventDetailPage' // Import EventDetailPage


const router = createBrowserRouter([
	{
		path: '/', element: <HomePage />,
	},
	{
		path: '/championships/:slug', element: <ChampionshipDetailPage />,
	},
	{
		path: '/events/:slug', element: <EventDetailPage />, // New route for events
	},
	
	])

	export default function App() {
	return (
		<RouterProvider router={router} />
	)
}
