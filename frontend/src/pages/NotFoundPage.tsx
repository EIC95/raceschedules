import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useEffect } from 'react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mt-4">Page Not Found</p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link 
              to="/" 
              className="mt-6 inline-block bg-black hover:bg-black text-white font-bold py-3 px-6 transition duration-300 ease-in-out shadow-lg"
            >
              Go to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
