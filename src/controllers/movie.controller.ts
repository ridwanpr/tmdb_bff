import type { Request, Response } from "express";
import type { MovieServiceType } from "../services/movie.service.js";

export const MovieController = (movieService: MovieServiceType) => {
  const getNowPlaying = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const results = await movieService.getNowPlaying(page);

    return res.json({
      success: true,
      message: "Fetch now playing movies success",
      data: results,
    });
  };

  const getPopular = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const results = await movieService.getPopular(page);

    return res.json({
      success: true,
      message: "Fetch now popular movies success",
      data: results,
    });
  };

  return { getNowPlaying, getPopular };
};
