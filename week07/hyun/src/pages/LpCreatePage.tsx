import { useNavigate } from 'react-router-dom';

const LpCreatePage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">새 LP 등록</h1>
            <p className="text-gray-600">
                곧 업로드 폼이 연결될 예정입니다. 지금은 임시로 마이페이지에서
                업로드 기능을 확인할 수 있습니다.
            </p>
            <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                onClick={() => navigate('/my')}
            >
                마이페이지로 이동
            </button>
        </div>
    );
};

export default LpCreatePage;

