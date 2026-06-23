import type { Watchlist } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type {
  CreateWatchlist,
  EditWatchlist,
  WatchlistParams,
} from "../schema/watchlist.schema.js";

export type WatchlistServiceType = {
  createWatchlist: (data: CreateWatchlist) => Promise<Watchlist>;
  editWatchlist: (params: WatchlistParams, data: EditWatchlist) => Promise<Watchlist>;
};

export const WatchlistService = () => {
  const createWatchlist = async (data: CreateWatchlist) => {
    return await prisma.watchlist.create({
      data: data,
    });
  };

  const editWatchlist = async (params: WatchlistParams, data: EditWatchlist) => {
    return await prisma.watchlist.update({
      where: {
        id: params.id,
      },
      data: {
        note: data.note,
        score: data.score,
      },
    });
  };

  return { createWatchlist, editWatchlist };
};
