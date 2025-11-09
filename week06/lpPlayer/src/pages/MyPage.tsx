import { useNavigate } from 'react-router-dom';
import { api } from '../apis/axios';
import { authStore } from '../authStore';
import { useMyInfoQuery } from '../hooks/queries/useMyInfoQuery';
import { StateMessage } from '../components/StateMessage';

export const MyPage = () => {
  const navigate = useNavigate();
  const { data: userInfo, isLoading, isError, refetch } = useMyInfoQuery();

  const handleLogout = async () => {
    try {
      await api.post('/auth/signout');
    } catch (err) {
      console.error('로그아웃 요청 실패:', err);
    } finally {
      authStore.logout();
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">내 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !userInfo) {
    return (
      <StateMessage
        title="사용자 정보를 가져올 수 없습니다"
        description="세션이 만료되었을 수 있어요. 다시 로그인 해보세요."
        actionLabel="다시 시도"
        onAction={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-12 w-full max-w-xl rounded-3xl border border-neutral-900 bg-neutral-950/80 p-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">마이페이지</h1>
        <h2 className="mb-4 text-xl font-semibold text-white">프로필 정보</h2>
        <div className="space-y-4">
          <>
            <span className="text-sm font-medium text-neutral-400">닉네임</span>
            <p className="mt-1 text-lg text-white">{userInfo?.name || '정보 없음'}</p>
          </>
          <>
            <span className="text-sm font-medium text-neutral-400">이메일</span>
            <p className="mt-1 text-lg text-white">{userInfo?.email || '정보 없음'}</p>
          </>
          <>
            <span className="text-sm font-medium text-neutral-400">소개</span>
            <p className="mt-1 text-lg text-white">{userInfo?.bio || '소개가 없습니다.'}</p>
          </>
          <>
            <span className="text-sm font-medium text-neutral-400">가입일</span>
            <p className="mt-1 text-lg text-white">
              {userInfo?.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR')
                : '정보 없음'}
            </p>
          </>
        </div>

        <div className="mt-8 border-t border-neutral-800 pt-4 text-right">
          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#ff2b9c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff4cad]"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};
