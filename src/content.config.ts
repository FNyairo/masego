import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections for the ESG & Sustainable Ports research site.
 * Schemas mirror the Decap CMS collections defined in public/admin/config.yml,
 * so anything edited at /admin validates here at build time.
 */

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    year: z.number(),
    type: z.enum(['journal', 'conference', 'policy-brief', 'working-paper', 'report', 'poster']),
    journal: z.string().optional(),
    conference: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    abstract: z.string().optional(),
    status: z.enum(['published', 'forthcoming', 'under-review']).default('published'),
    featured: z.boolean().default(false),
  }),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tag: z.string(),
    image: z.string().optional(),
    summary: z.string(),
    countries: z.array(z.string()).default([]),
    ports: z
      .array(
        z.object({
          name: z.string(),
          country: z.string(),
          lat: z.number(),
          lng: z.number(),
        })
      )
      .default([]),
    maritimeContext: z.string(),
    esgChallenges: z.array(z.string()).default([]),
    esgOpportunities: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['milestone', 'course', 'visit', 'conference', 'publication', 'engagement']),
    status: z.enum(['completed', 'in-progress', 'planned']).default('planned'),
    description: z.string(),
    order: z.number().default(0),
  }),
});

const frameworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/frameworks' }),
  schema: z.object({
    name: z.string(),
    abbreviation: z.string(),
    fullName: z.string(),
    description: z.string(),
    scope: z.enum(['global', 'maritime', 'regional', 'sectoral']),
    url: z.string().optional(),
    relevance: z.string(),
    order: z.number().default(0),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Standard', 'Report', 'Tool', 'Dataset', 'Reading']),
    source: z.string(),
    url: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { publications, regions, timeline, frameworks, resources };
