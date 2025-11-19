import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage } from '../apis/uploads';
import { patchLp, postLp, type LpPayload } from '../apis/lps';

type LpFormValues = {
  id?: number;
  title?: string;
  content?: string;
  tags?: string[];
  thumbnail?: string | null;
  published?: boolean;
};

type LpCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: LpFormValues;
  onCompleted?: () => void;
};

export const LpCreateModal = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData,
  onCompleted,
}: LpCreateModalProps) => {
  const isEditMode = mode === 'edit';
  const queryClient = useQueryClient();
  const baseData = useMemo<LpFormValues>(
    () => ({
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      tags: initialData?.tags ?? [],
      thumbnail: initialData?.thumbnail ?? null,
      published: initialData?.published ?? true,
      id: initialData?.id,
    }),
    [initialData],
  );

  const [title, setTitle] = useState(baseData.title ?? '');
  const [content, setContent] = useState(baseData.content ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(baseData.tags ?? []);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(baseData.thumbnail ?? null);
  const [published, setPublished] = useState<boolean>(baseData.published ?? true);

  const normalizedTagInput = tagInput.trim();

  useEffect(() => {
    if (!isOpen) return;
    setTitle(baseData.title ?? '');
    setContent(baseData.content ?? '');
    setTags(baseData.tags ?? []);
    setPreviewUrl(baseData.thumbnail ?? null);
    setThumbnailFile(null);
    setPublished(baseData.published ?? true);
    setTagInput('');
  }, [baseData, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const addTag = () => {
    if (!normalizedTagInput || tags.includes(normalizedTagInput)) return;
    setTags((prev) => [...prev, normalizedTagInput]);
    setTagInput('');
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((tag) => tag !== name));
  };

  const resetForm = () => {
    setTitle(baseData.title ?? '');
    setContent(baseData.content ?? '');
    setTagInput('');
    setTags(baseData.tags ?? []);
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(baseData.thumbnail ?? null);
    setThumbnailFile(null);
    setPublished(baseData.published ?? true);
  };

  const { mutateAsync: createLp, isPending: isCreating } = useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
    onError: (error) => {
      console.error('LP 생성 실패:', error);
      alert('LP 업로드에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutateAsync: updateLp, isPending: isUpdating } = useMutation({
    mutationFn: ({ lpId, payload }: { lpId: number; payload: LpPayload }) => patchLp(lpId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lp', variables.lpId] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
    onError: (error) => {
      console.error('LP 수정 실패:', error);
      alert('LP 수정 중 오류가 발생했습니다.');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;
    if (tags.length === 0) {
      alert('태그를 최소 1개 이상 입력해주세요.');
      return;
    }

    try {
      let thumbnailUrl = previewUrl ?? null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }
      if (!thumbnailUrl) {
        alert('썸네일 이미지를 업로드해주세요.');
        return;
      }

      const payload: LpPayload = {
        title: trimmedTitle,
        content: trimmedContent,
        tags,
        thumbnail: thumbnailUrl,
        published,
      };

      if (isEditMode && baseData.id) {
        await updateLp({ lpId: baseData.id, payload });
      } else {
        await createLp(payload);
      }

      resetForm();
      onClose();
      onCompleted?.();
    } catch (error) {
      console.error(error);
      alert('이미지를 업로드하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const hasThumbnail = Boolean(thumbnailFile) || Boolean(previewUrl);
  const isFormValid = title.trim().length > 0 && content.trim().length > 0 && tags.length > 0 && hasThumbnail;
  const canSubmit = isFormValid && !isSubmitting;
  const canAddTag = normalizedTagInput.length > 0 && !tags.includes(normalizedTagInput);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="LP 작성 모달"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-5 rounded-[28px] border border-neutral-800 bg-[#11131c] p-8 text-white shadow-[0_35px_90px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
              {isEditMode ? 'LP 수정' : '새 LP 등록'}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{isEditMode ? 'LP 글 수정' : 'LP 글 작성'}</h2>
          </div>
          <button
            type="button"
            onClick={handleBackdropClick}
            className="rounded-full p-1 text-neutral-500 transition-colors hover:text-white"
            aria-label="모달 닫기"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-dashed border-neutral-700 bg-black/20 p-4 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="LP 미리보기" className="mx-auto h-32 w-32 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-neutral-700 text-5xl text-neutral-700">
              ♫
            </div>
          )}
          <label className="inline-flex cursor-pointer flex-col items-center gap-2 text-sm font-medium text-neutral-300">
            LP 사진 업로드
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (previewUrl?.startsWith('blob:')) {
                  URL.revokeObjectURL(previewUrl);
                }
                setThumbnailFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            <span className="text-xs text-neutral-500">JPG, PNG 등 이미지 파일</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="LP 제목을 입력해주세요"
              className="w-full rounded-2xl border border-neutral-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#ff2b9c] focus:outline-none"
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="이 LP에 대한 소개를 작성해주세요"
              className="h-28 w-full resize-none rounded-2xl border border-neutral-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#ff2b9c] focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              placeholder="태그 입력"
              className="flex-1 rounded-2xl border border-neutral-700 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#ff2b9c] focus:outline-none"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!canAddTag}
              className="rounded-2xl bg-[#ff2b9c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ff4fb0] disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <span className="text-xs text-neutral-500">추가된 태그가 없습니다.</span>
            ) : (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-neutral-400 transition-colors hover:text-white"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 rounded border-neutral-600 bg-transparent text-[#ff2b9c] focus:ring-0"
            />
            공개 상태로 게시하기
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-[#ff2b9c] py-3 text-base font-semibold text-white transition-colors hover:bg-[#ff4fb0] disabled:cursor-not-allowed disabled:bg-neutral-700"
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '업로드 중...') : isEditMode ? 'LP 수정' : 'Add LP'}
        </button>
      </form>
    </div>
  );
};
