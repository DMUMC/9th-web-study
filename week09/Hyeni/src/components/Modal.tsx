import { useCartActions } from "../hooks/useCartStore";
import { useModalActions, useModalInfo } from "../hooks/useModalStore";


const Modal = () => {
    const { clearCart } = useCartActions();
    const { closeModal } = useModalActions();
    const isOpen = useModalInfo();

    if (!isOpen) return null;

    const handleNo = () => {
        closeModal();
    };

    const handleYes = () => {
        clearCart();
        closeModal();
    };

    return (
        <>
            <div className='fixed inset-0 bg-black/70 z-40' />
            <div
                onClick={handleNo}
                className='fixed inset-0 flex items-center justify-center z-50'
            >
                <div className='bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4'>
                    <p className='text-xl font-semibold mb-6 text-center'>
                        정말 삭제하시겠습니까?
                    </p>

                    <div className='flex gap-4 justify-center'>
                        <button
                            onClick={handleNo}
                            className='px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors cursor-pointer'
                        >
                            아니요
                        </button>

                        <button
                            onClick={handleYes}
                            className='px-6 py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors cursor-pointer'
                        >
                            네
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;