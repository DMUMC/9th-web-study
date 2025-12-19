import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
    return (
        // 페이지 전체에 Tailwind 배경/간격을 적용
        <main className='min-h-screen bg-slate-50'>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/movies/:movieId' element={<MovieDetailPage />} />
            </Routes>
        </main>
    );
}

export default App;
