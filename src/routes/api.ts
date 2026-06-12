import express from "express";

const apiRoute = express();

apiRoute.get("/", (req, res) => {
  res.send("hello world");
});

export { apiRoute };
