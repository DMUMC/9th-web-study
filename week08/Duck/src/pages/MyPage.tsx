import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileEditModal from '../components/ProfileEditModal';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

const MyPage = () => {
    const { data, isLoading, isError } = useGetMyInfo();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const formatDate = (date: Date | string) => {
        if (!date) return '알 수 없음';
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    const getInitials = (name: string | undefined) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500" />
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-4 rounded-xl bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                        사용자 정보를 불러올 수 없습니다
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-md bg-pink-500 px-6 py-2 text-white transition hover:bg-pink-600"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    const user = data.data;

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                <p className="mt-2 text-gray-600">
                    프로필 정보를 확인하고 관리할 수 있습니다.
                </p>
            </div>

            {/* 프로필 카드 */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12">
                    <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
                        {/* 아바타 */}
                        <div className="relative">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={`${user.name}의 프로필`}
                                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                                />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-pink-400 to-purple-500 text-4xl font-bold text-white shadow-xl">
                                    {getInitials(user.name)}
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-pink-500 shadow-lg transition hover:bg-gray-50"
                                aria-label="프로필 사진 변경"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* 사용자 정보 */}
                        <div className="flex-1 text-center text-white md:text-left">
                            <h2 className="text-3xl font-bold">{user.name}</h2>
                            <p className="mt-2 text-lg text-white/90">{user.email}</p>
                            {user.bio && (
                                <p className="mt-3 text-white/80">{user.bio}</p>
                            )}
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/lp/new')}
                                className="rounded-lg bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                            >
                                새 LP 작성
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="rounded-lg bg-white px-6 py-3 font-medium text-pink-600 transition hover:bg-gray-50"
                            >
                                프로필 수정
                            </button>
                        </div>
                    </div>
                </div>

                {/* 상세 정보 */}
                <div className="grid gap-6 p-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                사용자 ID
                            </label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                #{user.id}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                이메일
                            </label>
                            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                가입일
                            </label>
                            <p className="mt-1 text-lg text-gray-900">
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                최종 수정일
                            </label>
                            <p className="mt-1 text-lg text-gray-900">
                                {formatDate(user.updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-pink-600">
                                내 LP 수
                            </p>
                            <p className="mt-2 text-3xl font-bold text-pink-900">0</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200">
                            <svg
                                className="h-6 w-6 text-pink-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">
                                좋아요 받은 수
                            </p>
                            <p className="mt-2 text-3xl font-bold text-purple-900">0</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200">
                            <svg
                                className="h-6 w-6 text-purple-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                작성한 댓글
                            </p>
                            <p className="mt-2 text-3xl font-bold text-blue-900">0</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 빠른 액션 */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    빠른 액션
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => navigate('/lp/new')}
                        className="flex items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition hover:border-pink-500 hover:bg-pink-50"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                            <svg
                                className="h-6 w-6 text-pink-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">새 LP 작성</p>
                            <p className="text-sm text-gray-500">
                                새로운 LP를 등록하세요
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition hover:border-purple-500 hover:bg-purple-50"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <svg
                                className="h-6 w-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">LP 탐색</p>
                            <p className="text-sm text-gray-500">
                                다른 사용자의 LP를 둘러보세요
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">설정</p>
                            <p className="text-sm text-gray-500">
                                계정 설정을 변경하세요
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* 프로필 수정 모달 */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={user}
                onSuccess={() => {
                    // 프로필 수정 성공 시 데이터 다시 불러오기
                    const fetchData = async () => {
                        try {
                            setIsLoading(true);
                            setError(null);
                            const response = await getMyInfo();
                            setData(response);
                        } catch (err) {
                            console.error('Failed to fetch user info:', err);
                            setError('사용자 정보를 불러오는데 실패했습니다.');
                        } finally {
                            setIsLoading(false);
                        }
                    };
                    fetchData();
                }}
            />
        </div>
    );
};

export default MyPage;
