import mongoose from "mongoose";
import { TaskType, TodoType } from "../types/todo";
import { Schema, model, InferSchemaType } from "mongoose";

const taskSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>("Todo", todoSchema);
