import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { MovieService } from "../services/movie.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { AuthService } from "../services/auth.service.js";
import { RoleController } from "../controllers/role.controller.js";
import { RoleService } from "../services/role.service.js";

const apiRoute: Router = Router();

const movieService = MovieService();
const authService = AuthService();
const roleService = RoleService();

const movieController = MovieController(movieService);
const authController = AuthController(authService);
const roleController = RoleController(roleService);

apiRoute.get("/", authMiddleware, (req, res) => {
  res.send("hello world");
});

// Auth Routes
apiRoute.post("/register", authController.signUp);
apiRoute.post("/login", authController.login);
apiRoute.post("/logout", authMiddleware, authController.logout);

// Role Routes
apiRoute.post("/role", authMiddleware, roleController.store);
apiRoute.put("/role/:id", authMiddleware, roleController.update);
apiRoute.delete("/role/:id", authMiddleware, roleController.destroy);
apiRoute.get("/role/:id", authMiddleware, roleController.show);
apiRoute.get("/role", authMiddleware, roleController.index);

// Movie Routes
apiRoute.get("/now-playing", movieController.getNowPlaying);
apiRoute.get("/popular", movieController.getPopular);
apiRoute.get("/movie/:id", movieController.getDetail);
apiRoute.get("/search/movie", movieController.search);

export { apiRoute };
