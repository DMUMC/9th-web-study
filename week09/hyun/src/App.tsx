import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Footer from './components/Footer';

function App() {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden flex flex-col">
                <CartList />
            </main>
            <Footer />
        </div>
    );
}

export default App;
