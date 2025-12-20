import type { TTodo } from "../types/todo";
import { useReducer, type PropsWithChildren } from "react";
import { createContext } from "react";
import { useContext } from "react";

type State = {
  todos: TTodo[];
  done: TTodo[];
};

type Action =
  | { type: "ADD"; text: string }
  | { type: "COMPLETE"; id: number }
  | { type: "DELETE"; id: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const todo = { id: Date.now(), text: action.text };
      return {
        ...state,
        todos: [...state.todos, todo],
      };
    }
    case "COMPLETE": {
      const todoToComplete = state.todos.find((t) => t.id === action.id);
      if (!todoToComplete) {
        return state;
      }
      return {
        todos: state.todos.filter((t) => t.id !== action.id),
        done: [...state.done, todoToComplete],
      };
    }
    case "DELETE":
      return {
        ...state,
        done: state.done.filter((t) => t.id !== action.id),
      };
    default:
      return state;
  }
}

interface ITodoContext {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, { todos: [], done: [] });

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): ITodoContext => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
