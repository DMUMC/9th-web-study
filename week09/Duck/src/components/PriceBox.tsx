import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../slices/modalSlice";
import type { RootState } from "../store/store";

const PriceBox = () => {
  const { total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleOpenModal = (): void => {
    dispatch(openModal());
  };

  return (
    <div className="py-12  flex justify-between">
      <button
        onClick={handleOpenModal}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 비우기
      </button>
      <div>총 가격 : {total}원</div>
    </div>
  );
};

export default PriceBox;
