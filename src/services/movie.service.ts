import axios from "axios";
import { MoviePaginatedSchema, type MoviePaginatedResults } from "../models/movie.model.js";

export type MovieServiceType = {
  getNowPlaying: () => Promise<MoviePaginatedResults>;
  getPopular: () => Promise<MoviePaginatedResults>;
};

export const MovieService = (): MovieServiceType => {
  const getNowPlaying = async () => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/now_playing`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return MoviePaginatedSchema.parse(response.data);
  };

  const getPopular = async () => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/popular`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return MoviePaginatedSchema.parse(response.data);
  };

  return { getNowPlaying, getPopular };
};
