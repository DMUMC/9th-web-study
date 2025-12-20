import { useState, useRef } from 'react';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import useUpdateMyInfo from '../hooks/mutations/useUpdateMyInfo';
import useUploadImage from '../hooks/mutations/useUploadImage';

const MyPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] =
        useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<
        string | null
    >(null);
    const [uploadedImageUrl, setUploadedImageUrl] =
        useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, isPending, isError } = useGetMyInfo();
    const updateMyInfoMutation = useUpdateMyInfo();
    const uploadImageMutation = useUploadImage();

    const handleOpenModal = () => {
        if (data) {
            setName(data.name);
            setBio(data.bio || '');
            setImagePreview(data.avatar || null);
            setUploadedImageUrl(data.avatar || null);
            setProfileImage(null);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setName('');
        setBio('');
        setProfileImage(null);
        setImagePreview(null);
        setUploadedImageUrl(null);
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setUploadedImageUrl(null);
        }
    };

    const handleUploadImage = () => {
        if (!profileImage) {
            alert('이미지를 먼저 선택해주세요.');
            return;
        }

        uploadImageMutation.mutate(profileImage, {
            onSuccess: (response) => {
                setUploadedImageUrl(response.data.imageUrl);
                alert('이미지 업로드 완료!');
            },
            onError: (error) => {
                console.error('이미지 업로드 실패:', error);
                alert('이미지 업로드에 실패했습니다.');
            },
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        // 이미지가 선택되었지만 업로드되지 않은 경우
        if (profileImage && !uploadedImageUrl) {
            alert('이미지를 업로드해주세요.');
            return;
        }

        updateMyInfoMutation.mutate(
            {
                name: name.trim(),
                bio: bio.trim() || null,
                avatar: uploadedImageUrl || null,
            },
            {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (error) => {
                    console.error('정보 수정 실패:', error);
                    alert('정보 수정에 실패했습니다.');
                },
            }
        );
    };

    if (isPending) {
        return <div>로딩 중...</div>;
    }

    if (isError || !data) {
        return <div>내 정보를 불러오지 못했습니다.</div>;
    }

    return (
        <div className='mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    마이 페이지
                </h1>
                <button
                    type='button'
                    onClick={handleOpenModal}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    설정
                </button>
            </div>

            <div className='rounded-2xl border border-gray-700 bg-gray-900/60 p-6'>
                <div className='flex gap-6'>
                    <div className='flex-shrink-0'>
                        {data.avatar ? (
                            <img
                                src={data.avatar}
                                alt='프로필'
                                className='h-32 w-32 rounded-full object-cover'
                            />
                        ) : (
                            <div className='flex h-32 w-32 items-center justify-center rounded-full bg-gray-700 text-4xl font-semibold text-gray-400'>
                                {data.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className='flex-1 space-y-3'>
                        <div className='flex items-center gap-2'>
                            <div className='rounded-lg border border-white bg-black px-4 py-2 text-white'>
                                {data.name}
                            </div>
                        </div>
                        {data.bio && (
                            <div className='flex items-center gap-2'>
                                <div className='rounded-lg border border-white bg-black px-4 py-2 text-white'>
                                    {data.bio}
                                </div>
                            </div>
                        )}
                        <div className='text-gray-400'>
                            {data.email}
                        </div>
                    </div>
                </div>
            </div>

            {/* 수정 모달 */}
            {isModalOpen && (
                <>
                    <div
                        className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
                        onClick={handleCloseModal}
                        aria-hidden
                    />
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                        <div
                            className='relative w-full max-w-md rounded-2xl bg-[#1a1a20] p-6 shadow-2xl'
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            {/* X 버튼 */}
                            <button
                                type='button'
                                onClick={handleCloseModal}
                                className='absolute right-4 top-4 text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
                                aria-label='모달 닫기'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            </button>

                            <h2 className='mb-6 text-xl font-bold text-white'>
                                프로필 수정
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className='space-y-4'
                            >
                                {/* 프로필 사진 */}
                                <div className='flex flex-col items-center gap-3'>
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className='relative cursor-pointer rounded-full border-2 border-dashed border-gray-600 bg-gray-800/50 p-4 transition-colors hover:border-gray-500'
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={
                                                    imagePreview
                                                }
                                                alt='프로필 미리보기'
                                                className='h-32 w-32 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className='flex h-32 w-32 items-center justify-center rounded-full bg-gray-700 text-4xl font-semibold text-gray-400'>
                                                {name.charAt(
                                                    0
                                                ) || '?'}
                                            </div>
                                        )}
                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type='file'
                                            accept='image/*'
                                            onChange={
                                                handleImageChange
                                            }
                                            className='hidden'
                                        />
                                    </div>
                                    {profileImage &&
                                        !uploadedImageUrl && (
                                            <button
                                                type='button'
                                                onClick={
                                                    handleUploadImage
                                                }
                                                disabled={
                                                    uploadImageMutation.isPending
                                                }
                                                className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                {uploadImageMutation.isPending
                                                    ? '업로드 중...'
                                                    : '이미지 업로드'}
                                            </button>
                                        )}
                                    {uploadedImageUrl && (
                                        <div className='flex items-center gap-2 text-sm text-green-400'>
                                            <span>✓</span>
                                            <span>
                                                이미지
                                                업로드 완료
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 이름 */}
                                <div>
                                    <label
                                        htmlFor='name'
                                        className='mb-2 block text-sm font-medium text-gray-200'
                                    >
                                        이름
                                    </label>
                                    <input
                                        id='name'
                                        type='text'
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder='이름을 입력하세요'
                                        required
                                        className='w-full rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label
                                        htmlFor='bio'
                                        className='mb-2 block text-sm font-medium text-gray-200'
                                    >
                                        Bio (선택)
                                    </label>
                                    <input
                                        id='bio'
                                        type='text'
                                        value={bio}
                                        onChange={(event) =>
                                            setBio(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder='Bio를 입력하세요 (선택사항)'
                                        className='w-full rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                                    />
                                </div>

                                {/* 저장 버튼 */}
                                <button
                                    type='submit'
                                    disabled={
                                        updateMyInfoMutation.isPending
                                    }
                                    className='w-full rounded-lg bg-gray-600 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {updateMyInfoMutation.isPending
                                        ? '저장 중...'
                                        : '저장'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyPage;
