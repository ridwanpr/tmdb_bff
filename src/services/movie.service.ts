import axios from "axios";
import {
  MovieDetailSchema,
  MoviePaginatedSchema,
  type MovieDetail,
  type MoviePaginatedResults,
} from "../schema/movie.schema.js";

export type MovieServiceType = {
  getNowPlaying: (page: number) => Promise<MoviePaginatedResults>;
  getPopular: (page: number) => Promise<MoviePaginatedResults>;
  getDetail: (id: number) => Promise<MovieDetail>;
  search: (query: string) => Promise<MoviePaginatedResults>;
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

  const getDetail = async (id: number) => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return MovieDetailSchema.parse(response.data);
  };

  const search = async (query: string) => {
    const token = process.env.TMDB_TOKEN;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}/search/movie`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        query: query,
      },
    });

    return MoviePaginatedSchema.parse(response.data);
  };

  return { getNowPlaying, getPopular, getDetail, search };
};
