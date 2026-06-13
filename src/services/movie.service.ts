import axios from "axios";
import { MoviePaginatedSchema, type MoviePaginatedResults } from "../models/movie.model.js";

export type MovieServiceType = {
  getNowPlaying: (page: number) => Promise<MoviePaginatedResults>;
  getPopular: (page: number) => Promise<MoviePaginatedResults>;
};

export const MovieService = (): MovieServiceType => {
  const getNowPlaying = async (page: number) => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/now_playing`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        language: "en-US",
        page: page,
      },
    });

    return MoviePaginatedSchema.parse(response.data);
  };

  const getPopular = async (page: number) => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/popular`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        language: "en-US",
        page: page,
      },
    });

    return MoviePaginatedSchema.parse(response.data);
  };

  return { getNowPlaying, getPopular };
};
