import { useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
  const { total } = useCartInfo();

  return (
    <div className="py-12  flex justify-end">
      <div>총 가격 : {total}원</div>
    </div>
  );
};

export default PriceBox;
