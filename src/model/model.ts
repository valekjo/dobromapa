import { getCollection, getEntries, getEntry, type CollectionEntry } from "astro:content";

export type TopicData = {
    topic: CollectionEntry<'topics'>,
    criticalShifts: { category: string, shifts: CollectionEntry<'criticalShifts'>[]}[]
}
/**
 * Load all data needed to display topic in any way.
 */
export const getTopicData = async (topic: CollectionEntry<'topics'>): Promise<TopicData> => {
    const criticalShifts = await getCollection(
        'criticalShifts',
        ({data}) => data.topic.id === topic.id,
    );

    // Group shifts by category
    const shiftsByCategory: Record<string, typeof criticalShifts> = {};
    for(const shift of criticalShifts) {
        if (!shiftsByCategory[shift.data.category]) shiftsByCategory[shift.data.category] = [];
        shiftsByCategory[shift.data.category].push(shift);
    }

    const data = Object.entries(shiftsByCategory).toSorted().map(([name, shifts]) => ({
        category: name,
        shifts,
    }));

    return {
        topic,
        criticalShifts: data,
    }
}

export type ProjectData = {
    project: CollectionEntry<'projects'>
    topics: CollectionEntry<'topics'>[],
    criticalShifts: CollectionEntry<'criticalShifts'>[],
}

/**
 * Load all data needed to display project in any way.
 */
export const getProjectData = async (project: CollectionEntry<'projects'>): Promise<ProjectData> => {
    const criticalShifts = await getEntries(project.data.criticalShifts);

    const allTopics = await Promise.all(criticalShifts.map(shift=> getEntry(shift.data.topic)));
    const topics = [...new Set(allTopics)];

    return {
        project,
        criticalShifts,
        topics,
    }
}