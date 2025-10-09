import GoogleLogin from "../assets/web_dark_sq_SI@2x.png"

export const SocialLogin = () => {
  return (
    <>
      <button className='w-full flex justify-center'>
        <img src={GoogleLogin} alt="Google Logo" className='h-12' />
      </button>

      <div className='flex items-center my-2'>
        <hr className='flex-grow border-gray-600' />
        <span className='mx-4 text-gray-400'>OR</span>
        <hr className='flex-grow border-gray-600' />
      </div>
    </>
  );
};