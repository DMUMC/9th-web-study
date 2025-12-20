import { useState, useRef, useEffect } from 'react';
import useUpdateMyInfo from '../hooks/mutations/useUpdateMyInfo';
import type { ResponseMyInfoDto } from '../types/auth';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: ResponseMyInfoDto['data'] | null;
    onSuccess?: () => void;
}

const ProfileEditModal = ({
    isOpen,
    onClose,
    userData,
    onSuccess,
}: ProfileEditModalProps) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateMyInfo, isPending } = useUpdateMyInfo();

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setBio(userData.bio || '');
            setAvatarPreview(userData.avatar || null);
        }
    }, [userData, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        // JSON 형식으로 데이터 준비
        const body: {
            name: string;
            bio?: string;
            avatar?: string;
        } = {
            name: name.trim(),
        };

        if (bio.trim()) {
            body.bio = bio.trim();
        }

        // avatar는 URL 문자열이어야 함
        // 파일이 선택되었지만 아직 업로드되지 않은 경우, 기존 avatar URL 유지
        // 실제로는 파일을 먼저 업로드하고 그 URL을 받아야 함
        if (avatarPreview && avatarPreview.startsWith('http')) {
            // 기존 URL인 경우
            body.avatar = avatarPreview;
        } else if (avatar) {
            // 파일이 선택되었지만 업로드 API가 없는 경우
            // 일단 기존 avatar URL을 유지하거나, 파일 업로드 API를 호출해야 함
            // TODO: 파일 업로드 API가 있다면 여기서 호출하고 URL을 받아야 함
            if (userData?.avatar) {
                body.avatar = userData.avatar;
            }
        } else if (userData?.avatar) {
            // 파일이 선택되지 않았으면 기존 avatar URL 유지
            body.avatar = userData.avatar;
        }

        updateMyInfo(body, {
            onSuccess: () => {
                onSuccess?.();
                handleClose();
            },
            onError: (error: any) => {
                console.error('프로필 수정 실패:', error);
                if (error?.response?.status === 404) {
                    alert('프로필 수정 API가 아직 구현되지 않았습니다.');
                } else {
                    alert('프로필 수정에 실패했습니다.');
                }
            },
        });
    };

    const handleClose = () => {
        setName('');
        setBio('');
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* 배경 오버레이 */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden
            />

            {/* 모달 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 닫기 버튼 */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="닫기"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* 모달 내용 */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">
                            프로필 수정
                        </h2>

                        {/* 아바타 */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="프로필 미리보기"
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-2xl font-bold text-white">
                                        {name[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-pink-500 p-2 text-white transition hover:bg-pink-600"
                                    aria-label="프로필 사진 변경"
                                >
                                    <svg
                                        className="h-4 w-4"
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
                                </label>
                            </div>
                        </div>

                        {/* 입력 필드 */}
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    이름 *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="이름을 입력하세요"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="bio"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    소개 (선택)
                                </label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="자기소개를 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 제출 버튼 */}
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || !name.trim()}
                                className="flex-1 rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfileEditModal;