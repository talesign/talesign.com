import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    link: z.string().optional(),
    featured: z.boolean(),
    description: z.string(),
    type: z.enum(["work", "personal"]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.string().date(),
    updated: z.string().date(),
  }),
});

export const collections = {
  projects,
  blog,
};
