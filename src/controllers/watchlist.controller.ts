import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createWatchlistSchema,
  editWatchlistSchema,
  watchlistParams,
} from "../schema/watchlist.schema.js";
import type { WatchlistServiceType } from "../services/watchlist.service.js";

export const WatchlistController = (watchlistService: WatchlistServiceType) => {
  const store = async (req: AuthenticatedRequest, res: Response) => {
    const body = createWatchlistSchema.parse(req.body);
    const result = await watchlistService.createWatchlist(body);

    return res.json({
      success: true,
      message: "Create watchlist item success",
      data: result,
    });
  };

  const update = async (req: AuthenticatedRequest, res: Response) => {
    const params = watchlistParams.parse(req.params);
    const body = editWatchlistSchema.parse(req.body);

    const result = await watchlistService.editWatchlist(params, body);
    return res.json({
      success: true,
      message: "Create watchlist item success",
      data: result,
    });
  };

  return { store, update };
};
