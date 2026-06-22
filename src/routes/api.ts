import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { MovieService } from "../services/movie.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, signUpSchema } from "../schema/auth.schema.js";
import { AuthService } from "../services/auth.service.js";
import { RoleController } from "../controllers/role.controller.js";
import { createRoleSchema } from "../schema/role.schema.js";
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

apiRoute.post("/register", validate(signUpSchema), authController.signUp);
apiRoute.post("/login", validate(loginSchema), authController.login);
apiRoute.post("/logout", authMiddleware, authController.logout);

apiRoute.post("/role", authMiddleware, validate(createRoleSchema), roleController.store);

apiRoute.get("/now-playing", movieController.getNowPlaying);
apiRoute.get("/popular", movieController.getPopular);
apiRoute.get("/movie/:id", movieController.getDetail);
apiRoute.get("/search/movie", movieController.search);

export { apiRoute };
