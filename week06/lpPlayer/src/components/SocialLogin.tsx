import GoogleLogin from "../assets/GG.png";

interface SocialLoginProps {
  onGoogleClick: () => void;
}

export const SocialLogin = ({ onGoogleClick }: SocialLoginProps) => {
  return (
    <>
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-700 bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-neutral-500"
      >
        <img src={GoogleLogin} alt="Google Logo" className="h-5 w-5" />
        구글 로그인
      </button>

      <div className="my-6 flex items-center gap-4 text-neutral-500">
        <hr className="flex-1 border-neutral-800" />
        <span className="text-xs tracking-[0.3em]">OR</span>
        <hr className="flex-1 border-neutral-800" />
      </div>
    </>
  );
};
