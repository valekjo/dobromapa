import { getCollection, getEntries, getEntry, type CollectionEntry } from "astro:content";

export type ShiftWithProjects = {
    shift: CollectionEntry<'criticalShifts'>,
    projects: CollectionEntry<'projects'>[],
}

export type TopicData = {
    topic: CollectionEntry<'topics'>,
    criticalShifts: { 
        category: string,
        shifts: ShiftWithProjects[],
    }[],
    /** All projects related to the topic */
    projects: CollectionEntry<'projects'>[],
}
/**
 * Load all data needed to display topic in any way.
 * 
 * TODO: Optimize this if needed.
 * 
 */
export const getTopicData = async (topic: CollectionEntry<'topics'>): Promise<TopicData> => {
    const criticalShifts = await getCollection(
        'criticalShifts',
        ({data}) => data.topic.id === topic.id,
    );

    const allProjects = new Set<CollectionEntry<'projects'>>();

    // Group shifts by category
    const shiftsByCategory: Record<string, {
        shift: CollectionEntry<'criticalShifts'>
        projects: CollectionEntry<'projects'>[],
    }[]> = {};
    for(const shift of criticalShifts) {
        if (!shiftsByCategory[shift.data.category]) shiftsByCategory[shift.data.category] = [];
        const projects = await getCollection(
            'projects',
            ({data}) => data.criticalShifts.some(({id}) => id === shift.id),
        );
        shiftsByCategory[shift.data.category].push({ shift, projects });
        projects.forEach((project) => allProjects.add(project))
    }

    const data = Object.entries(shiftsByCategory).toSorted().map(([name, shifts]) => ({
        category: name,
        shifts,
    }));

    return {
        topic,
        criticalShifts: data,
        projects: [...allProjects],
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