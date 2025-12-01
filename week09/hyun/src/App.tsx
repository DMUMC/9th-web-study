import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
    const { isOpen: isModalOpen } = useStore();

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden flex flex-col">
                <CartList />
            </main>
            <Footer />
            {isModalOpen && <Modal />}
        </div>
    );
}

export default App;
