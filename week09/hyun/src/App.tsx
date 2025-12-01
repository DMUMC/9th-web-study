import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
    const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);

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
