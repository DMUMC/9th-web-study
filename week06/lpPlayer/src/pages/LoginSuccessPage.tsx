import { Link } from "react-router-dom";

export const LoginSuccessPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-black/60 px-8 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur">
        <h1 className="text-3xl font-semibold">로그인에 성공했어요!</h1>
        <p className="mt-4 text-sm text-neutral-300">
          이제 다양한 기능을 이용할 수 있습니다. 아래 버튼을 눌러 원하는 화면으로 이동해 보세요.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/"
            className="rounded-xl bg-[#ff2b9c] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff4cab]"
          >
            홈으로 이동
          </Link>
          <Link
            to="/mypage"
            className="rounded-xl border border-neutral-700 py-3 text-sm font-semibold text-white transition-colors hover:border-[#ff2b9c]"
          >
            마이페이지 바로가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
