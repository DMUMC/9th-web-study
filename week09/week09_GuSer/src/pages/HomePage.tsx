import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto text-center py-20">
      <h1 className="text-5xl font-bold mb-8">DOLIGO - 돌려돌려 LP판</h1>
      <p className="text-xl text-gray-400 mb-12">
        소중한 LP 컬렉션을 공유하고 탐색하세요
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/lps"
          className="px-8 py-4 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors"
        >
          LP 탐색하기
        </Link>
        <Link
          to="/login"
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
        >
          로그인
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

