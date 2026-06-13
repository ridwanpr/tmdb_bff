import type { Request, Response } from "express";
import type { MovieServiceType } from "../services/movie.service.js";

export const MovieController = (movieService: MovieServiceType) => {
  const getNowPlaying = async (req: Request, res: Response) => {
    const results = await movieService.getNowPlaying();

    return res.json({
      success: true,
      message: "Fetch now playing movies success",
      data: results,
    });
  };

  const getPopular = async (req: Request, res: Response) => {
    const results = await movieService.getPopular();

    return res.json({
      success: true,
      message: "Fetch now playing movies success",
      data: results,
    });
  };

  return { getNowPlaying, getPopular };
};
