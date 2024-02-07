import { Document } from "mongoose";
import { TodoType } from "./todo";

export interface UserType extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  todos: TodoType[];
}
