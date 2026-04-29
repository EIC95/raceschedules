import type { MetadataRoute } from 'next'
import { fetchChampionships, type Championship } from '../api/championships'
import { fetchEvents, type Event } from '../api/events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://raceschedules.app'

    let championships: Championship[] = []
    let events: Event[] = []

    // Do not catch errors here. If the API fails, we want the sitemap generation 
    // to throw a 500 error instead of returning a 200 OK with an empty list.
    championships = await fetchChampionships();
    events = await fetchEvents();

    const championshipUrls = championships.map((c) => ({
        url: `${baseUrl}/championships/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    const eventUrls = events.map((e) => ({
        url: `${baseUrl}/events/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...championshipUrls,
        ...eventUrls,
    ]
}
