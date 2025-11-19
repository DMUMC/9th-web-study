import { useState, useRef } from 'react';
import useCreateLP from '../hooks/mutations/useCreateLp';

interface LpCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createLP, isPending } = useCreateLP();

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            // 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        // thumbnail 파일이 있으면 Base64로 변환
        if (thumbnail) {
            // 이미지 파일 크기 제한 (예: 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (thumbnail.size > maxSize) {
                alert('이미지 파일 크기는 5MB 이하여야 합니다.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Base64 data URL에서 순수 Base64 문자열만 추출
                // data:image/png;base64,iVBORw0KG... -> iVBORw0KG...
                const base64DataUrl = reader.result as string;
                const base64String = base64DataUrl.includes(',')
                    ? base64DataUrl.split(',')[1]
                    : base64DataUrl;

                // JSON 형식으로 데이터 준비
                const body: {
                    title: string;
                    content: string;
                    thumbnail?: string;
                    tags?: string[];
                    published: boolean;
                } = {
                    title: trimmedTitle,
                    content: trimmedContent,
                    thumbnail: base64String, // 순수 Base64 문자열
                    published: true,
                };

                // tags가 있으면 추가
                if (tags.length > 0) {
                    body.tags = tags;
                }

                // 전송 전 데이터 확인
                console.log('LP 생성 요청 데이터:', {
                    title: body.title,
                    content: body.content,
                    thumbnail: body.thumbnail
                        ? `${body.thumbnail.substring(0, 50)}... (길이: ${
                              body.thumbnail.length
                          })`
                        : undefined,
                    tags: body.tags,
                    published: body.published,
                });

                // 전송
                createLP(body, {
                    onSuccess: () => {
                        // 폼 초기화
                        setTitle('');
                        setContent('');
                        setTags([]);
                        setTagInput('');
                        setThumbnail(null);
                        setThumbnailPreview(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        onClose();
                    },
                    onError: (error: unknown) => {
                        console.error('LP 생성 실패:', error);
                        const axiosError = error as {
                            response?: {
                                data?: { message?: string } | unknown;
                                status?: number;
                                statusText?: string;
                            };
                            message?: string;
                        };
                        console.error('에러 응답 전체:', axiosError?.response);
                        console.error(
                            '에러 응답 데이터:',
                            axiosError?.response?.data
                        );
                        console.error(
                            '에러 상태 코드:',
                            axiosError?.response?.status
                        );
                        console.error(
                            '에러 상태 텍스트:',
                            axiosError?.response?.statusText
                        );
                        console.error('에러 메시지:', axiosError?.message);

                        const errorData = axiosError?.response?.data as
                            | { message?: string }
                            | undefined;
                        const errorMessage =
                            errorData?.message ||
                            axiosError?.message ||
                            'LP 생성에 실패했습니다.';
                        alert(`LP 생성에 실패했습니다: ${errorMessage}`);
                    },
                });
            };
            reader.onerror = () => {
                alert('이미지 파일을 읽는 중 오류가 발생했습니다.');
            };
            reader.readAsDataURL(thumbnail);
            return;
        }

        // thumbnail이 없으면 바로 전송
        const body: {
            title: string;
            content: string;
            thumbnail?: string;
            tags?: string[];
            published: boolean;
        } = {
            title: trimmedTitle,
            content: trimmedContent,
            published: true,
        };

        // tags가 있으면 추가
        if (tags.length > 0) {
            body.tags = tags;
        }

        // 전송 전 데이터 확인
        console.log('LP 생성 요청 데이터:', body);

        // 전송
        createLP(body, {
            onSuccess: () => {
                // 폼 초기화
                setTitle('');
                setContent('');
                setTags([]);
                setTagInput('');
                setThumbnail(null);
                setThumbnailPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                onClose();
            },
            onError: (error) => {
                console.error('LP 생성 실패:', error);
                alert('LP 생성에 실패했습니다.');
            },
        });
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        setTags([]);
        setTagInput('');
        setThumbnail(null);
        setThumbnailPreview(null);
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
                    className="relative w-full max-w-2xl rounded-2xl bg-gray-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 닫기 버튼 */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
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
                        {/* LP 이미지 영역 */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative h-64 w-64 overflow-hidden rounded-lg bg-gray-700">
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="LP 썸네일 미리보기"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <svg
                                            className="h-32 w-32 text-gray-500"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                    </div>
                                )}
                                {/* 이미지 업로드 버튼 */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="thumbnail-upload"
                                />
                                <label
                                    htmlFor="thumbnail-upload"
                                    className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-pink-500 p-2 text-white transition hover:bg-pink-600"
                                    aria-label="이미지 업로드"
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
                                </label>
                            </div>
                        </div>

                        {/* 입력 필드 */}
                        <div className="space-y-4">
                            {/* LP Name */}
                            <div>
                                <label
                                    htmlFor="lp-name"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    LP Name
                                </label>
                                <input
                                    id="lp-name"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="LP 이름을 입력하세요"
                                    required
                                />
                            </div>

                            {/* LP Content */}
                            <div>
                                <label
                                    htmlFor="lp-content"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    LP Content
                                </label>
                                <textarea
                                    id="lp-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="LP 내용을 입력하세요"
                                    required
                                />
                            </div>

                            {/* LP Tag */}
                            <div>
                                <label
                                    htmlFor="lp-tag"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    LP Tag
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="lp-tag"
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="태그를 입력하세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="rounded-lg bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-500"
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* 태그 목록 */}
                                {tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                    className="text-pink-300 hover:text-pink-100"
                                                    aria-label={`${tag} 태그 제거`}
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
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 제출 버튼 */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-lg bg-gray-700 px-6 py-3 font-medium text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? '생성 중...' : 'Add LP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LpCreateModal;