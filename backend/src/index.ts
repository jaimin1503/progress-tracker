import express from "express";
import "dotenv/config";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import userRoutes from "../routes/userRoutes";

const app = express();
const port = env.PORT | 3000;

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    console.log("database connected");
    app.listen(port, () => {
      console.log("server running on port: ", port);
    });
  })
  .catch(console.error);
