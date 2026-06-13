import type { Request, Response } from "express";
import type { MovieServiceType } from "../services/movie.service.js";
import { ResponseError } from "../exceptions/responseError.js";

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

  const getDetail = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ResponseError(400, "ID Param is not a valid number");
    }

    const results = await movieService.getDetail(id);

    return res.json({
      success: true,
      message: "Fetch movie detail success",
      data: results,
    });
  };

  const search = async (req: Request, res: Response) => {
    const query = req.query.query;
    if (!query) {
      throw new ResponseError(400, "Search query is required");
    }

    const results = await movieService.search(query as string);

    return res.json({
      success: true,
      message: "Search movie success",
      data: results,
    });
  };

  return { getNowPlaying, getPopular, getDetail, search };
};
