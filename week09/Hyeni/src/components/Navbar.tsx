import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { calculateTotals } from "../slices/cartslice";
import type { RootState } from "../stores/store";


const Navbar = () => {
  const { amount, cartItems } = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();

  useEffect((): void => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={(): void => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold cursor-pointer"
      >
        Hyeni Playlist
      </h1>
      <div className="flex items-center gap-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;