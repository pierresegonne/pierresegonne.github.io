import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // One folder per post: src/content/posts/<Slug>/index.md, images next to it.
  // The frontmatter `slug` is used verbatim as the entry id, which keeps the
  // case-sensitive Jekyll URLs (/Normalizing_flows/).
  loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    /** Canonical URL when the post was first published elsewhere. */
    canonical: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
