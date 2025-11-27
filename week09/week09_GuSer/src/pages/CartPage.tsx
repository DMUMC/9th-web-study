import { useEffect } from 'react';
import { useCartStore } from '../store/zustand/cartStore';
import { useModalStore } from '../store/zustand/modalStore';
import ConfirmModal from '../components/Modal/ConfirmModal';
import cartItems from '../constants/cartItems';

const CartPage = () => {
  const { cartItems: items, amount, total, setInitialItems, increase, decrease, removeItem, clearCart } = useCartStore();
  const { isOpen, open, close } = useModalStore();

  useEffect(() => {
    if (items.length === 0) {
      setInitialItems(cartItems);
    }
  }, [items.length, setInitialItems]);

  const handleClearCart = () => {
    clearCart();
    close();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">장바구니가 비어있습니다.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg p-6 flex items-center gap-6"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-2">{item.singer}</p>
                  <p className="text-pink-600 font-bold">
                    {Number(item.price).toLocaleString()}원
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrease(item.id)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.amount}</span>
                    <button
                      onClick={() => increase(item.id)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span>총 수량:</span>
              <span className="font-bold">{amount}개</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>총 금액:</span>
              <span className="font-bold text-pink-600">
                {total.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={() => open()}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
            >
              전체 삭제
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={isOpen}
        title="장바구니 비우기"
        message="정말로 장바구니를 모두 비우시겠습니까?"
        onConfirm={handleClearCart}
        onCancel={close}
        confirmText="네"
        cancelText="아니요"
      />
    </div>
  );
};

export default CartPage;

