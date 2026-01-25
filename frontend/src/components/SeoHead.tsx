import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description = "Stay updated with the latest race schedules, championship standings, and event details.",
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
}) => {
    const defaultTitle = "Race Schedules";
    const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={ogTitle || fullTitle} />
            <meta property="og:description" content={ogDescription || description} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={twitterTitle || fullTitle} />
            <meta name="twitter:description" content={twitterDescription || description} />
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}
        </Helmet>
    );
};

export default SeoHead;