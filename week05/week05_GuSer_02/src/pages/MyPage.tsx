import { useEffect, useState } from 'react';
import { getMyInfo, updateMyAvatar } from '../apis/auth';
import type { ResponseMyInfoDto } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// 기본 프로필 이미지 (없을 때 표시)
import defaultProfile from '../assets/profile.svg';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 기존 변수명/흐름 유지
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  // 업로드용 로컬 상태 (새로 추가)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 내 정보 불러오기
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (e) {
        console.error('내 정보 조회 실패', e);
      }
    };
    getData();
  }, []);

  // 파일 선택 시 미리보기 세팅
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    // 미리보기
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // 업로드 실행
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('이미지를 선택해주세요.');
      return;
    }
    try {
      setIsUploading(true);
      await updateMyAvatar(selectedFile); // 서버 업로드
      // 업로드 후 최신 정보 재조회
      const res = await getMyInfo();
      setData(res);
      alert('프로필 이미지가 업데이트되었습니다.');
      // 미리보기 초기화
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (e) {
      console.error('프로필 이미지 업로드 실패', e);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userName = data?.data?.name ?? '';
  const userEmail = data?.data?.email ?? '';
  const userAvatar = data?.data?.avatar || defaultProfile;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* ✅ 1) 환영 인사 */}
      <h1 className="text-2xl font-bold mt-6">
        {userName ? `${userName}님 환영합니다.` : '환영합니다.'}
      </h1>

      {/* ✅ 2) 프로필 이미지 + 업로드 UI */}
      <div className="flex flex-col items-center gap-3">
        {/* 현재 등록된 아바타(없으면 기본 이미지) */}
        <img
          src={previewUrl || userAvatar}
          alt="profile avatar"
          className="w-28 h-28 rounded-full object-cover border border-gray-300"
        />

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
          >
            {isUploading ? '업로드 중...' : '프로필 업로드'}
          </button>
        </div>
        {previewUrl && (
          <p className="text-xs text-gray-400">미리보기를 확인하고 업로드를 눌러주세요.</p>
        )}
      </div>

      {/* ✅ 3) 로그인한 계정 이메일 */}
      <div className="text-sm text-gray-300">
        <span className="font-semibold">로그인 계정: </span>
        <span>{userEmail || '-'}</span>
      </div>

      {/* 로그아웃 */}
      <button
        className="cursor-pointer bg-blue-500 text-white rounded-md px-5 py-3 hover:scale-95 transition"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
