import './App.css';
import MoviePage from './pages/MoviePage';

function App() {
  console.log(import.meta.env.VITE_TMDM_KEY);
  return (
  <>
    <MoviePage />
  </>
  );
}

export default App;


