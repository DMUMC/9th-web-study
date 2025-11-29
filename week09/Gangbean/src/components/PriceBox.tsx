import { useDispatch, useSelecter } from '../hooks/useCustomRedux';
import { clearCart } from '../slices/cartslice';

const PriceBox = () => {
    const { total } = useSelecter((state) => state.cart);
    const dispatch = useDispatch();

    const handleInitializeCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className='p-12 flex justify-between'>
            <button
                onClick={handleInitializeCart}
                className='border p-4 rounded-md cursor-pointer'
            >
                장바구니 초기화
            </button>
            <div>총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;
