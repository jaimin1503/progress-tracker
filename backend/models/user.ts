import { Schema, model, InferSchemaType } from "mongoose";
import { UserType } from "../types/user";
import mongoose from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
