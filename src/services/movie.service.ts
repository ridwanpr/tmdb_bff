import axios from "axios";
import type { PaginatedResults } from "../types/common.js";
import type { MovieSummary } from "../models/movie.model.js";

export type MovieServiceType = {
  getNowPlaying: () => Promise<PaginatedResults<MovieSummary>>;
};

export const MovieService = (): MovieServiceType => {
  const getNowPlaying = async () => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get<PaginatedResults<MovieSummary>>(
      `${process.env.TMDB_BASE_URL}/movie/now_playing`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  };

  return { getNowPlaying };
};
