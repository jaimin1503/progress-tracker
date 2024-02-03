import mongoose from "mongoose";
import { TaskType, TodoType } from "../types/todo";
import { Schema, model } from "mongoose";

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export default model<TodoType>("Todo", todoSchema);
