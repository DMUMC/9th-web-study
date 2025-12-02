import CartItems from "./CartItems";
import { useCartInfo, useCartActions } from "../hooks/useCartStore";
import { openModal } from "../slices/modalSlice";

const CartList = () => {
  const { cartItems } = useCartInfo();
  const { clearCart } = useCartActions();

  const handleClearCart = (): void => {
    openModal();
    clearCart();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItems key={item.id} lp={item} />
        ))}
      </ul>
      <button onClick={handleClearCart}>Clear Cart</button>
    </div>
  );
};

export default CartList;