import './App.css';
import HomePage from './pages/HomePage';

function App() {
    return (
        // 페이지 전체에 Tailwind 배경/간격을 적용
        <main className='min-h-screen bg-slate-50'>
            <HomePage />
        </main>
    );
}

export default App;
