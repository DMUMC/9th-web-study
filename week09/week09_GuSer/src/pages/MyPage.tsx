import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, patchUser } from '../apis/auth';
import { useUserStore } from '../store/zustand/userStore';

const MyPage = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.nickname);
      setBio(currentUser.bio || '');
      setProfileImagePreview(currentUser.profileImage || '');
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  const updateMutation = useMutation({
    mutationFn: (data: { nickname?: string; bio?: string; profileImage?: File }) =>
      patchUser(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user', 'me'] });
      const previousUser = queryClient.getQueryData(['user', 'me']);

      queryClient.setQueryData(['user', 'me'], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousUser };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', 'me'], context.previousUser);
      }
    },
    onSuccess: (data) => {
      setUser(data);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: { nickname?: string; bio?: string; profileImage?: File } = {};
    if (nickname !== currentUser?.nickname) updateData.nickname = nickname;
    if (bio !== (currentUser?.bio || '')) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    if (Object.keys(updateData).length > 0) {
      updateMutation.mutate(updateData);
    } else {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-800 rounded-lg" />
          <div className="h-8 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      <div className="bg-gray-800 rounded-lg p-8 space-y-6">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt={currentUser.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-400">
                    {currentUser.nickname[0]}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.nickname}</h2>
                <p className="text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            {currentUser.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-2">소개</h3>
                <p className="text-gray-300">{currentUser.bio}</p>
              </div>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
            >
              수정하기
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">프로필 이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Preview"
                  className="mt-4 w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">소개 (선택)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600 resize-none"
                placeholder="자기소개를 입력하세요"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNickname(currentUser.nickname);
                  setBio(currentUser.bio || '');
                  setProfileImage(null);
                  setProfileImagePreview(currentUser.profileImage || '');
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyPage;

