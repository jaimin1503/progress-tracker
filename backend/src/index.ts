import express from "express";
import "dotenv/config";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import userRoutes from "../routes/userRoutes";
import goalRoutes from "../routes/goalRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = env.PORT | 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", userRoutes);
app.use("/goal", goalRoutes);
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
