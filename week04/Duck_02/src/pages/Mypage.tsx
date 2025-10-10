import { useEffect, useState } from "react";
import { getMyinfo } from "../apis/auth";
import { type ResponeMyInfoDto } from "../types/auth";

export default function Mypage() {
  const [data, setData] = useState<ResponeMyInfoDto | null>(null);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyinfo();
      console.log(response);
      setData(response);
    };
    getData();
  }, []);
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="name"
          className="text-2xl font-bold border border-[#ccc] w-[300px] p-2 focus:border-[#333] rounded-md"
          value={data?.data.name}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
