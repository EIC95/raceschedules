import { useHead } from '@unhead/react';

export default function SEO({ title, description, canonical, image }: { title: string; description: string; canonical?: string; image?: string }) {
  const siteName = 'RaceSchedules';
  const fullTitle = title && title !== '' ? `${title}` : siteName;

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: canonical ? [{ rel: 'canonical', href: canonical }] : [],
  });

  return null;
}