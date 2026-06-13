import { z } from "zod";

export const createPaginatedResultsSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    dates: z
      .object({
        maximum: z.string(),
        minimum: z.string(), 
      })
      .optional(),
    page: z.number(),
    results: z.array(resultSchema),
    total_pages: z.number(),
    total_results: z.number(),
  });

export const MovieSummarySchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  title: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  softcore: z.boolean(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const MoviePaginatedSchema = createPaginatedResultsSchema(MovieSummarySchema);

export type MovieSummary = z.infer<typeof MovieSummarySchema>;
export type MoviePaginatedResults = z.infer<typeof MoviePaginatedSchema>;
