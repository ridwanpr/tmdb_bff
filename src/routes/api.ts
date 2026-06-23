import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { MovieService } from "../services/movie.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { AuthService } from "../services/auth.service.js";
import { RoleController } from "../controllers/role.controller.js";
import { RoleService } from "../services/role.service.js";
import { accessMiddleware } from "../middleware/access.middleware.js";
import { PermissionService } from "../services/permission.service.js";
import { PermissionController } from "../controllers/permission.controller.js";

const apiRoute: Router = Router();

const movieService = MovieService();
const authService = AuthService();
const roleService = RoleService();
const permissionService = PermissionService();

const movieController = MovieController(movieService);
const authController = AuthController(authService);
const roleController = RoleController(roleService);
const permissionController = PermissionController(permissionService);

apiRoute.get("/", authMiddleware, (req, res) => {
  res.send("hello world");
});

// Auth Routes
apiRoute.post("/register", authController.signUp);
apiRoute.post("/login", authController.login);
apiRoute.post("/logout", authMiddleware, authController.logout);

// Role Routes
apiRoute.post("/role", authMiddleware, accessMiddleware("role:create"), roleController.store);
apiRoute.put("/role/:id", authMiddleware, accessMiddleware("role:edit"), roleController.update);
apiRoute.delete(
  "/role/:id",
  authMiddleware,
  accessMiddleware("role:delete"),
  roleController.destroy,
);
apiRoute.get("/role/:id", authMiddleware, accessMiddleware("role:show"), roleController.show);
apiRoute.get("/role", authMiddleware, accessMiddleware("role:list"), roleController.index);

// Permission Routes
apiRoute.post(
  "/permission",
  authMiddleware,
  accessMiddleware("permission:edit"),
  permissionController.update,
);
apiRoute.get(
  "/permission/:role_id",
  authMiddleware,
  accessMiddleware("permission:show"),
  permissionController.show,
);

// Movie Routes
apiRoute.get("/now-playing", movieController.getNowPlaying);
apiRoute.get("/popular", movieController.getPopular);
apiRoute.get("/movie/:id", movieController.getDetail);
apiRoute.get("/search/movie", movieController.search);

export { apiRoute };
