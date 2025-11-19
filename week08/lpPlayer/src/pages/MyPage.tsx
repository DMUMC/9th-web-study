import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyInfoQuery } from '../hooks/queries/useMyInfoQuery';
import { StateMessage } from '../components/StateMessage';
import { patchMyInfo, postSignout } from '../apis/auth';
import { uploadImage } from '../apis/uploads';
import { useAuth } from '../useAuth';
import type { UpdateProfilePayload, UserProfileDto } from '../types/auth';

export const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading, isError, refetch } = useMyInfoQuery();
  const { setLogout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!userInfo) return;
    setNameInput(userInfo.name ?? '');
    setBioInput(userInfo.bio ?? '');
    if (!avatarFile) {
      setAvatarPreview(userInfo.avatar ?? null);
    }
  }, [userInfo, avatarFile]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const resetEditingState = () => {
    if (userInfo) {
      setNameInput(userInfo.name ?? '');
      setBioInput(userInfo.bio ?? '');
      setAvatarPreview(userInfo.avatar ?? null);
    } else {
      setNameInput('');
      setBioInput('');
      setAvatarPreview(null);
    }
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
  } = useMutation({
    mutationFn: patchMyInfo,
    onMutate: async (payload: UpdateProfilePayload) => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      const previousUser = queryClient.getQueryData<UserProfileDto>(['me']);
      if (previousUser) {
        const optimisticUser: UserProfileDto = {
          ...previousUser,
          name: payload.name ?? previousUser.name,
          bio: payload.bio !== undefined ? payload.bio : previousUser.bio,
          avatar: payload.avatar !== undefined ? payload.avatar : previousUser.avatar,
        };
        queryClient.setQueryData(['me'], optimisticUser);
      }
      return { previousUser };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['me'], context.previousUser);
      }
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useMutation({
    mutationFn: uploadImage,
    onError: () => {
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      setLogout();
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate('/login');
    },
    onError: () => {
      alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleLogout = async () => {
    if (isLoggingOut) return;
    logout();
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      alert('이름을 입력해주세요.');
      return;
    }

    let avatarUrlToSend: string | null | undefined = undefined;

    try {
      if (avatarFile) {
        const imageUrl = await uploadAvatar(avatarFile);
        avatarUrlToSend = imageUrl;
      } else if (shouldRemoveAvatar) {
        avatarUrlToSend = null;
      }

      const payload: UpdateProfilePayload = {
        name: trimmedName,
        bio: bioInput?.trim() ? bioInput.trim() : null,
      };
      if (avatarUrlToSend !== undefined) {
        payload.avatar = avatarUrlToSend;
      }

      await updateProfile(payload);
      if (avatarUrlToSend !== undefined) {
        setAvatarPreview(avatarUrlToSend);
      }
      setIsEditing(false);
      setAvatarFile(null);
      setShouldRemoveAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    resetEditingState();
    setIsEditing(false);
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
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">마이페이지</h1>
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleCancelEdit();
                setIsEditing(false);
              } else {
                resetEditingState();
                setIsEditing(true);
              }
            }}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-neutral-500"
          >
            {isEditing ? '설정 닫기' : '설정'}
          </button>
        </div>
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

        {isEditing && (
          <form onSubmit={handleProfileSubmit} className="mt-8 space-y-5 rounded-2xl border border-neutral-800 bg-[#101015] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-neutral-700 bg-black/20">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="프로필 미리보기" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm text-neutral-500">No Image</span>
                )}
              </div>
              <label className="flex flex-1 flex-col gap-2 text-sm text-white">
                프로필 사진
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      setAvatarFile(null);
                      if (avatarPreview && avatarPreview.startsWith('blob:')) {
                        URL.revokeObjectURL(avatarPreview);
                      }
                      setAvatarPreview(userInfo?.avatar ?? null);
                      setShouldRemoveAvatar(false);
                      return;
                    }
                    if (avatarPreview && avatarPreview.startsWith('blob:')) {
                      URL.revokeObjectURL(avatarPreview);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    setAvatarFile(file);
                    setAvatarPreview(previewUrl);
                    setShouldRemoveAvatar(false);
                  }}
                  className="rounded-xl border border-neutral-700 bg-black/20 px-3 py-2 text-sm text-white focus:border-[#ff2b9c] focus:outline-none"
                />
                <span className="text-xs text-neutral-500">선택 사항이며 비워도 저장할 수 있어요.</span>
                <button
                  type="button"
                  onClick={() => {
                    if (avatarPreview && avatarPreview.startsWith('blob:')) {
                      URL.revokeObjectURL(avatarPreview);
                    }
                    setAvatarPreview(null);
                    setAvatarFile(null);
                    setShouldRemoveAvatar(true);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="self-start text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
                >
                  이미지 제거
                </button>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="name">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-700 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ff2b9c] focus:outline-none"
                placeholder="이름을 입력해주세요"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="bio">
                Bio (선택)
              </label>
              <textarea
                id="bio"
                value={bioInput ?? ''}
                onChange={(event) => setBioInput(event.target.value)}
                className="mt-2 h-28 w-full resize-none rounded-xl border border-neutral-700 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ff2b9c] focus:outline-none"
                placeholder="간단한 소개를 입력해주세요"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-white hover:border-neutral-500"
                disabled={isUpdatingProfile || isUploadingAvatar}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!nameInput.trim() || isUpdatingProfile || isUploadingAvatar}
                className="rounded-xl bg-[#ff2b9c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff4cad] disabled:cursor-not-allowed disabled:bg-neutral-700"
              >
                {isUpdatingProfile || isUploadingAvatar ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-neutral-800 pt-4 text-right">
          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#ff2b9c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff4cad] disabled:cursor-not-allowed disabled:bg-neutral-700"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>
    </div>
  );
};
