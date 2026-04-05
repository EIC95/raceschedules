import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "404 - Page Not Found",
};

export default function NotFoundPage() {
    return (
        <main className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">404</p>
                <h1 className="text-4xl font-extrabold text-black dark:text-white uppercase mb-3">Page not found</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    This page doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase px-6 py-3 hover:opacity-70 transition-opacity"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
