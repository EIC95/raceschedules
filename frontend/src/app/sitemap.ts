import type { MetadataRoute } from 'next'
import { fetchChampionships, type Championship } from '../api/championships'
import { fetchEvents, type Event } from '../api/events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://raceschedules.app'

    let championships: Championship[] = []
    let events: Event[] = []

    try {
        championships = await fetchChampionships()
    } catch (err) { }

    try {
        events = await fetchEvents()
    } catch (err) { }

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
