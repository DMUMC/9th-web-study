// import TodoBefore from './components/TodoBefore';
import Todo from './components/Todo';
import { TodoProvider } from './context/todoContext';

function App() {
    return (
        <TodoProvider>
            <Todo></Todo>
            {/* <TodoBefore></TodoBefore> */}
        </TodoProvider>
    );
}

export default App;
