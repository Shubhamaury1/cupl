import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTodo } from "../features/todo/todoSlice";
function Todo() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  return (
    <>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button
            onClick={() => dispatch(removeTodo(todo.id))}
            className="mt-5 ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-6 rounded text-lg"
          
          >
            Delete Todo
          </button>
        </li>
      ))}
    </>
  );
}

export default Todo;
