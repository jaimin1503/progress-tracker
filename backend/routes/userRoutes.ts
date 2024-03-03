import express from "express";
const router = express.Router();

import { auth } from "../middleware/auth";
import { signup, login } from "../controllers/userController";
import {
  newTodo,
  deleteTodo,
  editTodo,
  getTodos,
  editTask,
  newTask,
  deleteTask,
} from "../controllers/todoController";

router.post("/signup", signup);
router.post("/login", login);
router.post("/newtodo", auth, newTodo);
router.post("/deletetodo/:todoid", auth, deleteTodo);
router.put("/edittodo/:todoid", auth, editTodo);
router.get("/gettodos", auth, getTodos);
router.put("/todos/:todoId/tasks/:taskId", auth, editTask);
router.post("/todos/:todoid/newtask", auth, newTask);
router.delete("/todos/:todoid/deletetask/:taskId", auth, deleteTask);

export default router;
