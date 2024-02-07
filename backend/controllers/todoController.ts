import Todo from "../models/todoModel";
import User from "../models/user";
import { Request, Response } from "express";
import { UserType } from "../types/user";
import { TodoType, TaskType } from "../types/todo";

export const newTodo = async (req: Request, res: Response) => {
  try {
    const userId: string = req.user?.userid;
    const { title, tasks } = req.body;

    if (!(userId && title && tasks)) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID, title, and tasks for the new todo.",
      });
    }

    // Check if the user exists
    const user: UserType | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new todo
    const todo = await Todo.create({
      title,
      tasks,
    });

    // Associate the new todo with the user
    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming profileid is the ID of the profile document you want to update
      { $push: { todos: todo } }, // Corrected $push syntax
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Todo created successfully and associated with the user.",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while creating todo and associating with user, and the error is ${error}`,
    });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.todoid;
  try {
    await Todo.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "todo is deleted success fully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while deleting todo and error is ${error}`,
    });
  }
};

export const editTodo = async (req: Request, res: Response) => {
  const id = req.params.todoid;
  try {
    const { title, tasks }: { title?: string; tasks?: TaskType[] } = req.body;
    const todo = await Todo.findById(id);
    if (todo) {
      const newTodo: { title?: string; tasks?: TaskType[] } = {
        title: undefined,
        tasks: undefined,
      };
      if (title) {
        newTodo.title = title;
      }
      if (tasks) {
        newTodo.tasks = tasks;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(id, newTodo, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        todo: updatedTodo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while editing todo, and the error is ${error}`,
    });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId: string = req.user.userid;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request.",
      });
    }

    const user: UserType | null = await User.findById(userId)
      .populate({
        path: "todos",
        model: "Todo",
        populate: {
          path: "tasks",
          model: "Task",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All todos fetched successfully.",
      todos: user.todos,
      tasks: user.todos?.tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while getting todos: ${error}`,
    });
  }
};

export const editTask = async (req: Request, res: Response) => {
  const { todoId, taskId } = req.params; // Extract todoId and taskId from the request parameters
  const { content, done }: { content?: string; done?: boolean } = req.body; // Extract updated content and done status from the request body

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const task: TaskType = todo.tasks?.id(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found in the specified todo" });
    }

    task.content = content !== undefined ? content : task.content; // Update content if provided
    task.done = done !== undefined ? done : task.done; // Update done status if provided

    await todo.save(); // Save the changes

    res
      .status(200)
      .json({ message: "Task updated successfully", updatedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
