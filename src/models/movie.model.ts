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
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  title: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  softcore: z.boolean(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const MovieDetailSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z.unknown().nullable(),
  budget: z.number(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    }),
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number().nullable(),
  softcore: z.boolean(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const MoviePaginatedSchema = createPaginatedResultsSchema(MovieSummarySchema);

export type MovieSummary = z.infer<typeof MovieSummarySchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type MoviePaginatedResults = z.infer<typeof MoviePaginatedSchema>;
