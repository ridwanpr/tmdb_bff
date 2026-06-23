import type { Watchlist } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateWatchlist } from "../schema/watchlist.schema.js";

export type WatchlistServiceType = {
  createWatchlist: (data: CreateWatchlist) => Promise<Watchlist>;
};

export const WatchlistService = () => {
  const createWatchlist = async (data: CreateWatchlist) => {
    return await prisma.watchlist.create({
      data: data,
    });
  };

  return { createWatchlist };
};
