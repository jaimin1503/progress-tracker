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
type Task = InferSchemaType<typeof taskSchema>;

export const Todo = model<Todo>("Todo", todoSchema);
export const Task = model<Task>("Task", taskSchema);
