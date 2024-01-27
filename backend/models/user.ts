import { Schema, model } from "mongoose";
import { UserType } from "../types/user";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<UserType>("User", userSchema);
