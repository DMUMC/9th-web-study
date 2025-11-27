import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">페이지를 찾을 수 없습니다</p>
        <Link
          to="/"
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

