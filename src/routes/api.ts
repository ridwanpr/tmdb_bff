import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { MovieService } from "../services/movie.service.js";

const apiRoute = Router();

const movieService = MovieService();
const movieController = MovieController(movieService);

apiRoute.get("/", (req, res) => {
  res.send("hello world");
});

apiRoute.get("/now-playing", movieController.getNowPlaying);
apiRoute.get("/popular", movieController.getPopular);
apiRoute.get("/movie/:id", movieController.getDetail);
apiRoute.get("/search/movie", movieController.search);

export { apiRoute };
