import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";

const baseButton =
  "rounded-lg px-5 py-2 text-sm font-semibold transition-colors";
const outlineButton =
  "bg-black border border-neutral-700 text-white hover:border-neutral-500";
const primaryButton =
  "bg-[#ff2b9c] text-white hover:bg-[#ff4cad] shadow-md";

export default function Header() {
  const { isLoggedIn, setLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("로그아웃 되었습니다!");
    setLogout();
    navigate("/");
  };

  return (
    <div className="flex h-20 items-center justify-between bg-black px-8">
      <Link to="/">
        <div className="text-2xl font-bold text-[#ff2b9c]">돌려돌려LP판</div>
      </Link>

      <div className="flex items-center gap-3 text-sm text-white">
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className={`${baseButton} ${outlineButton}`}>
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              className={`${baseButton} ${primaryButton}`}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${baseButton} ${outlineButton}`}>
              로그인
            </Link>
            <Link to="/signup" className={`${baseButton} ${primaryButton}`}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
