import { useState, useRef, useEffect } from 'react';
import useUpdateLp from '../hooks/mutations/useUpdateLp';
import useUploadImage from '../hooks/mutations/useUploadImage';
import type { Lp } from '../types/lp';

type EditLpModalProps = {
    isOpen: boolean;
    onClose: () => void;
    lp: Lp;
};

const EditLpModal = ({ isOpen, onClose, lp }: EditLpModalProps) => {
    const [lpName, setLpName] = useState(lp.title);
    const [lpContent, setLpContent] = useState(lp.content);
    const [lpTag, setLpTag] = useState('');
    const [tags, setTags] = useState<string[]>(
        lp.tags.map((tag) => tag.name)
    );
    const [lpImage, setLpImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        lp.thumbnail
    );
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        lp.thumbnail
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImageMutation = useUploadImage();
    const updateLpMutation = useUpdateLp();

    // lp가 변경될 때 초기값 설정
    useEffect(() => {
        setLpName(lp.title);
        setLpContent(lp.content);
        setTags(lp.tags.map((tag) => tag.name));
        setImagePreview(lp.thumbnail);
        setUploadedImageUrl(lp.thumbnail);
        setLpImage(null);
    }, [lp]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setLpImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setUploadedImageUrl(null);
        }
    };

    const handleUploadImage = () => {
        if (!lpImage) {
            alert('이미지를 먼저 선택해주세요.');
            return;
        }

        uploadImageMutation.mutate(lpImage, {
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

    const handleAddTag = () => {
        if (lpTag.trim() && !tags.includes(lpTag.trim())) {
            setTags([...tags, lpTag.trim()]);
            setLpTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!lpName.trim()) {
            alert('LP 이름을 입력해주세요.');
            return;
        }

        if (!uploadedImageUrl) {
            alert('이미지를 업로드해주세요.');
            return;
        }

        updateLpMutation.mutate(
            {
                lpId: lp.id,
                body: {
                    title: lpName,
                    content: lpContent,
                    thumbnail: uploadedImageUrl,
                    tags: tags,
                    published: lp.published,
                },
            },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: (error) => {
                    console.error('LP 수정 실패:', error);
                    alert('LP 수정에 실패했습니다.');
                },
            }
        );
    };

    const handleClose = () => {
        setLpName(lp.title);
        setLpContent(lp.content);
        setLpTag('');
        setTags(lp.tags.map((tag) => tag.name));
        setLpImage(null);
        setImagePreview(lp.thumbnail);
        setUploadedImageUrl(lp.thumbnail);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
                onClick={handleClose}
                aria-hidden
            />
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <div
                    className='relative w-full max-w-md rounded-2xl bg-[#1a1a20] p-6 shadow-2xl'
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type='button'
                        onClick={handleClose}
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

                    <h2 className='mb-6 text-xl font-semibold text-white'>
                        LP 수정
                    </h2>

                    <div className='mb-6 flex flex-col items-center gap-3'>
                        <div
                            onClick={handleImageClick}
                            className='relative cursor-pointer rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 p-4 transition-colors hover:border-gray-500'
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt='LP 미리보기'
                                    className='h-48 w-48 rounded-lg object-cover'
                                />
                            ) : (
                                <div className='flex h-48 w-48 items-center justify-center'>
                                    <div className='text-center'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='mx-auto h-12 w-12 text-gray-500'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                            />
                                        </svg>
                                        <p className='mt-2 text-sm text-gray-400'>
                                            LP 사진을 선택하세요
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                className='hidden'
                            />
                        </div>

                        {lpImage && !uploadedImageUrl && (
                            <button
                                type='button'
                                onClick={handleUploadImage}
                                disabled={uploadImageMutation.isPending}
                                className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {uploadImageMutation.isPending
                                    ? '업로드 중...'
                                    : '이미지 업로드'}
                            </button>
                        )}

                        {uploadedImageUrl && lpImage && (
                            <div className='flex items-center gap-2 text-sm text-green-400'>
                                <span>✓</span>
                                <span>이미지 업로드 완료</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label
                                htmlFor='lpName'
                                className='mb-2 block text-sm font-medium text-gray-200'
                            >
                                LP Name
                            </label>
                            <input
                                id='lpName'
                                type='text'
                                value={lpName}
                                onChange={(event) =>
                                    setLpName(event.target.value)
                                }
                                placeholder='LP 이름을 입력하세요'
                                className='w-full rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='lpContent'
                                className='mb-2 block text-sm font-medium text-gray-200'
                            >
                                LP Content
                            </label>
                            <textarea
                                id='lpContent'
                                value={lpContent}
                                onChange={(event) =>
                                    setLpContent(event.target.value)
                                }
                                placeholder='LP 내용을 입력하세요'
                                rows={4}
                                className='w-full resize-y rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='lpTag'
                                className='mb-2 block text-sm font-medium text-gray-200'
                            >
                                LP Tag
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    id='lpTag'
                                    type='text'
                                    value={lpTag}
                                    onChange={(event) =>
                                        setLpTag(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    placeholder='태그를 입력하세요'
                                    className='flex-1 rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                                />
                                <button
                                    type='button'
                                    onClick={handleAddTag}
                                    className='rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    Add
                                </button>
                            </div>
                            {tags.length > 0 && (
                                <div className='mt-2 flex flex-wrap gap-2'>
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className='inline-flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-200'
                                        >
                                            {tag}
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    handleRemoveTag(tag)
                                                }
                                                className='text-gray-400 hover:text-white focus:outline-none'
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={
                                updateLpMutation.isPending ||
                                uploadImageMutation.isPending
                            }
                            className='w-full rounded-lg bg-gray-600 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {updateLpMutation.isPending
                                ? '수정 중...'
                                : '수정하기'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditLpModal;

