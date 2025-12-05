import CartItem from './CartItem';
import { useSelecter } from '../hooks/useCustomRedux';

const CartList = () => {
    const { cartItems } = useSelecter((state) => state.cart);

    return (
        <div className='flex flex-col items-center justify-center'>
            <ul>
                {cartItems.map((item) => (
                    <CartItem key={item.id} lp={item} />
                ))}
            </ul>
        </div>
    );
};

export default CartList;