// 1. Import utilities from `astro:content`
import { defineCollection, z, reference } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Define your collection(s)
const projects = defineCollection({ 
    loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) => z.object({
        name: z.string(),
        url: z.string().url().nullish(),
        topics: z.array(reference('topics')).min(1),
        relatedProjects: z.array(reference('projects')).nullish(),
        image: image().nullish(),
        perex: z.string(),
        location: z.array(z.number()).min(2).max(2).nullish(),
    })
});

const topics = defineCollection({
    loader: glob({ base: './src/content/topics', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        name: z.string(),
        icon: z.string(),
    })
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { projects, topics };