// 1. Import utilities from `astro:content`
import { defineCollection, z, reference } from 'astro:content';

// 2. Import loader(s)
import { file, glob } from 'astro/loaders';

// 3. Define your collection(s)
const projects = defineCollection({ 
    loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
    schema: ({ image }) => z.object({
        name: z.string(),
        url: z.string().url().nullish(),
        criticalShifts: z.array(reference('criticalShifts')).min(1),
        image: image().nullish(),
        perex: z.string(),
        location: z.array(z.number()).min(2).max(2).nullish(),
    }),
});

const topics = defineCollection({
    loader: glob({ base: './src/content/topics', pattern: '**/*.md' }),
    schema: z.object({
        name: z.string(),
        icon: z.string(),
    }),
});

const criticalShifts = defineCollection({
    loader: file('./src/content/critical-shifts/critical-shifts.json'),
    schema: z.object({
        id: z.string(),
        topic: reference('topics'),
        category: z.string(),
        name: z.string(),
        statusQuo: z.string(),
        desiredState: z.string(),
    }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { projects, topics, criticalShifts };