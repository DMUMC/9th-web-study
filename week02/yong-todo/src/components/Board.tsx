import TodoColumn from "./TodoColumn";
import DoneColumn from "./DoneColumn";

export default function Board() {
  return (
    <div className="render-container">
      <TodoColumn />
      <DoneColumn />
    </div>
  );
}




