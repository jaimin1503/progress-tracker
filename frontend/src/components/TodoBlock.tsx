import { useState, useEffect } from "react";
import "./CompStyles.css";
import axios from "axios";

const TodoBlock = () => {
  type TaskType = {
    _id: string;
    content: string;
    done: boolean;
  };
  type TodoType = {
    _id: string;
    title: string;
    tasks: TaskType[];
  };

  const [todos, setTodos] = useState<TodoType[]>([]); // Specify the type for the state
  const [title, setTitle] = useState<string>(""); // Specify the type for the state
  // The 'task' state is not being used, consider removing it

  const handleInputChange = (
    todo_idx: number,
    index: number,
    updatedValue: string
  ) => {
    const updatedTodos: TodoType[] = [...todos];
    updatedTodos[todo_idx].tasks[index].content = updatedValue; // Access 'content' property
    setTodos(updatedTodos);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/gettodos", { withCredentials: true })
      .then((res) => {
        setTodos(res.data.todos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo_id: string,
    task_id: string
  ) => {
    if (event.key === "Enter") {
      axios
        .put(
          `http://localhost:3000/user/todos/${todo_id}/tasks/${task_id}`,
          { todos },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="flex mt-20 flex-wrap">
      {todos.map((todo: TodoType, todo_idx: number) => (
        <div
          key={todo._id}
          className="todo-card border rounded-2xl h-[400px] w-[350px] flex flex-col mx-5 bg-blue-100"
        >
          <div className="title border-b border-gray-600 w-full flex justify-center bg-yellow-300 rounded-t-2xl">
            <input
              className="text-3xl my-1 bg-transparent outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="tasks flex flex-col p-5">
            {todo.tasks.map((task: TaskType, index: number) => (
              <div key={task._id}>
                <input
                  type="checkbox"
                  id={`cbtest-${todo._id}-${index}`} // Unique ID for each checkbox
                  className="cursor-pointer"
                />
                <input
                  className="px-2 text-xl bg-transparent outline-none"
                  value={task.content}
                  onChange={(e) =>
                    handleInputChange(todo_idx, index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyPress(e, todo._id, task._id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoBlock;
