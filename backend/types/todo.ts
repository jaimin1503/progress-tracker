import { Document } from "mongoose";

export interface TaskType extends Document {
  _id: string;
  content: string;
  done: boolean;
}

export interface TodoType extends Document {
  _id: string;
  title: string;
  tasks: TaskType[];
}
