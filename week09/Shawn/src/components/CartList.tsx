import CartItems from "./CartItems";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const CartList = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItems key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;
