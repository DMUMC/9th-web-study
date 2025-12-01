import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { increase, decrease, removeItem } from '../store/cartSlice';

const CartList = () => {
    const { cartItems, amount, total } = useSelector(
        (state: RootState) => state.cart
    );
    const dispatch = useDispatch<AppDispatch>();

    const handleIncrease = (id: string) => {
        dispatch(increase(id));
    };

    const handleDecrease = (id: string) => {
        dispatch(decrease(id));
    };

    const handleRemoveItem = (id: string) => {
        dispatch(removeItem(id));
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">
                    장바구니가 비어있습니다.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-b border-gray-200"
                        >
                            {/* 앨범 이미지 */}
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded"
                            />

                            {/* 제목, 아티스트, 가격 */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {item.singer}
                                </p>
                                <p className="text-gray-800 font-medium mt-2">
                                    ${parseInt(item.price).toLocaleString()}
                                </p>
                            </div>

                            {/* 수량 조절 버튼 */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleDecrease(item.id)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                >
                                    <span className="text-gray-700 font-semibold">
                                        -
                                    </span>
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-900">
                                    {item.amount}
                                </span>
                                <button
                                    onClick={() => handleIncrease(item.id)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                >
                                    <span className="text-gray-700 font-semibold">
                                        +
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="ml-2 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 총 수량 및 총 금액 표시 - Footer 위에 고정 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                        총 수량:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                        {amount}개
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                        총 금액:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                        ${total.toLocaleString()}
                    </span>
                </div>
            </div>
        </>
    );
};

export default CartList;
