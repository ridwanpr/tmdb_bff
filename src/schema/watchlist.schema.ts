import z from "zod";

export const createWatchlistSchema = z.object({
  user_id: z.uuid(),
  movie_id: z.coerce.number(),
  score: z.coerce.number().min(1).max(10),
  note: z.string().min(2),
});

export type CreateWatchlist = z.infer<typeof createWatchlistSchema>;
