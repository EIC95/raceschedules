"use client";

import { useEffect, useState } from 'react';

const SURVEY_URL = 'https://forms.gle/ioGXh34hAjci5Liy6';
const REAPPEAR_DAYS = 7;
const LS_DISMISSED_KEY = 'feedback_dismissed_at';
const LS_COMPLETED_KEY = 'feedback_completed';

type BannerState = 'hidden' | 'banner' | 'badge';

export default function FeedbackBanner() {
    const [state, setState] = useState<BannerState>('hidden');
    const [visible, setVisible] = useState(false);

    // Determine initial state from localStorage on mount
    useEffect(() => {
        if (localStorage.getItem(LS_COMPLETED_KEY)) return;

        const dismissedAt = localStorage.getItem(LS_DISMISSED_KEY);
        if (dismissedAt) {
            const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / 86_400_000;
            if (daysSince < REAPPEAR_DAYS) {
                setState('badge');
                return;
            }
        }

        setState('banner');
    }, []);

    // Trigger slide-up animation after the banner mounts
    useEffect(() => {
        if (state !== 'banner') return;
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, [state]);

    const dismiss = () => {
        setVisible(false);
        setTimeout(() => {
            localStorage.setItem(LS_DISMISSED_KEY, Date.now().toString());
            setState('badge');
        }, 280);
    };

    const openSurvey = () => {
        window.open(SURVEY_URL, '_blank', 'noopener,noreferrer');
        localStorage.setItem(LS_COMPLETED_KEY, 'true');
        setVisible(false);
        setTimeout(() => setState('hidden'), 280);
    };

    const reopenBanner = () => {
        localStorage.removeItem(LS_DISMISSED_KEY);
        setVisible(false);
        setState('banner');
    };

    if (state === 'hidden') return null;

    if (state === 'badge') {
        return (
            <button
                onClick={reopenBanner}
                aria-label="Open feedback survey"
                className="
                    fixed bottom-16 -right-px z-50
                    flex items-center gap-1.5
                    bg-black dark:bg-white
                    text-white dark:text-black
                    text-xs font-semibold
                    pl-2.5 pr-3 py-2
                    rounded-l-full
                    shadow-lg
                    hover:opacity-80
                    transition-opacity duration-200
                    cursor-pointer
                "
            >
                <span aria-hidden="true">⚡</span>
                <span>Feedback</span>
            </button>
        );
    }

    return (
        <div
            role="dialog"
            aria-label="Feedback invitation"
            aria-live="polite"
            className={`
                fixed bottom-4 right-4
                sm:bottom-6 sm:right-6
                z-50
                w-[min(calc(100vw-2rem),22rem)]
                transition-all duration-280 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}
            `}
        >
            <div className="
                bg-white dark:bg-neutral-900
                border border-gray-200 dark:border-neutral-700
                rounded-2xl
                shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                p-4
            ">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0" aria-hidden="true">⚡</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                            Help us improve RaceSchedules in 2 minutes
                        </p>
                    </div>

                    <button
                        onClick={dismiss}
                        aria-label="Dismiss"
                        className="
                            shrink-0 -mt-0.5 -mr-0.5 p-1
                            text-gray-400 hover:text-gray-700
                            dark:text-neutral-500 dark:hover:text-neutral-200
                            transition-colors duration-150
                            cursor-pointer
                        "
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path
                                d="M3 3l8 8M11 3l-8 8"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* CTA */}
                <button
                    onClick={openSurvey}
                    className="
                        mt-3 w-full
                        bg-black dark:bg-white
                        text-white dark:text-black
                        text-sm font-semibold
                        py-2 px-4
                        rounded-xl
                        hover:opacity-80
                        active:scale-[0.98]
                        transition-all duration-150
                        cursor-pointer
                    "
                >
                    Give feedback
                </button>
            </div>
        </div>
    );
}
