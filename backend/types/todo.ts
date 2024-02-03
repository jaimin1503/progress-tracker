import { Document } from "mongoose";

export interface TaskType extends Document {
  content: string;
  done: boolean;
}

export interface TodoType extends Document {
  title: string;
  tasks: TaskType[];
}
