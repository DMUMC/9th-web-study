import { ThemeProvider } from '../context/ThemeProvider';
import Navbar from './Navbar';
import ThemeContent from './themeContent';

export default function ContextPage() {
    return (
        <ThemeProvider>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Navbar />
                <main className="flex-1">
                    <ThemeContent />
                </main>
            </div>
        </ThemeProvider>
    );
}
