import './App.css';
import UseMemoPage from './pages/UseMemoPage';

function App() {
    return (
        // 데모 페이지만 감싸는 레이아웃 컨테이너
        <main className='flex flex-col items-center justify-center h-dvh'>
            <UseMemoPage />
        </main>
    );
}

export default App;
