import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { MovieService } from "../services/movie.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const apiRoute = Router();

const movieService = MovieService();
const movieController = MovieController(movieService);

const authController = AuthController();

apiRoute.get("/", (req, res) => {
  res.send("hello world");
});

apiRoute.get("/now-playing", movieController.getNowPlaying);
apiRoute.get("/popular", movieController.getPopular);
apiRoute.get("/movie/:id", movieController.getDetail);
apiRoute.get("/search/movie", movieController.search);

apiRoute.post("/signup", authController.signUp);
apiRoute.post("/login", authController.login);
apiRoute.post("/logout", authMiddleware, authController.logout);

export { apiRoute };
