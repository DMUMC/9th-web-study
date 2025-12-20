import { useStore } from '../store/useStore';

const Footer = () => {
    const { openModal } = useStore();

    const handleOpenModal = () => {
        openModal();
    };

    return (
        <footer className="bg-gray-100 px-6 py-4 flex justify-center">
            <button
                onClick={handleOpenModal}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                전체 삭제
            </button>
        </footer>
    );
};

export default Footer;
