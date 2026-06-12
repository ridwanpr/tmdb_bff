import express from "express";
import { apiRoute } from "./routes/api.js";
import { logging } from "./config/logging.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = 3000;

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
