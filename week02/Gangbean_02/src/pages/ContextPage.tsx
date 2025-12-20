import Counter from '../components/Counter';
import Navbar from '../components/Navbar';
import ThemeContent from '../components/ThemeContent';
import { CounterProvider } from '../context/CounterProvider';
import { ThemeProvider } from '../context/ThemeProvider';

const ContextPage = () => {
    return (
        <ThemeProvider>
            <CounterProvider>
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Navbar />
                    <main className='flex-1 w-full'>
                        <ThemeContent />
                        <Counter />
                    </main>
                </div>
            </CounterProvider>
        </ThemeProvider>
    );
};

export default ContextPage;
