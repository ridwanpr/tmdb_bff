import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { apiRoute } from "./routes/api.js";
import { logging } from "./config/logging.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 24000 * 7 }, // 7 day
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRoute);

app.use((_req, res) => {
  return res.sendStatus(404);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  logging.info(`Server running on port: ${PORT}`);
});
