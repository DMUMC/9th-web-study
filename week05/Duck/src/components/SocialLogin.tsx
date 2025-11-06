import { useState } from "react";
import GoogleLogin from "../assets/web_dark_sq_SI@2x.png";

export const SocialLogin = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleGoogleLogin = () => {
    if (isClicked) return;
    setIsClicked(true);
    window.location.href = `${
      import.meta.env.VITE_SERVER_API_URL
    }/v1/auth/google/login`;
  };

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        disabled={isClicked}
        className={`w-full flex justify-center hover:opacity-80 transition-opacity
          ${isClicked ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <img
          src={GoogleLogin}
          alt="Google Logo"
          className="h-12 cursor-pointer"
        />
      </button>

      <div className="flex items-center my-2">
        <hr className="flex-grow border-gray-600" />
        <span className="mx-4 text-gray-400">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>
    </>
  );
};
