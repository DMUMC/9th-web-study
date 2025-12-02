import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";
import type { RootState } from "../store/store";

const Modal = () => {
  const { isOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleNoClick = (): void => {
    dispatch(closeModal());
  };

  const handleYesClick = (): void => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 배경 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleNoClick}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 z-10">
        <h2 className="text-2xl font-bold mb-4">장바구니 비우기</h2>
        <p className="text-gray-600 mb-6">정말로 장바구니를 비우시겠습니까?</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleNoClick}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            No
          </button>
          <button
            onClick={handleYesClick}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;