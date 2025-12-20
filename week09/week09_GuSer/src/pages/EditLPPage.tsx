import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLP, updateLP } from '../apis/lp';
import LPDetailSkeleton from '../components/Skeleton/LPDetailSkeleton';

const EditLPPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: lp, isLoading } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLP(Number(lpId)),
    enabled: !!lpId,
  });

  useEffect(() => {
    if (lp) {
      setName(lp.name);
      setContent(lp.content);
      setTags(lp.tags);
      setImagePreview(lp.imageUrl);
    }
  }, [lp]);

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; content?: string; tags?: string[]; image?: File }) =>
      updateLP(Number(lpId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate(`/lp/${lpId}`);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: { name?: string; content?: string; tags?: string[]; image?: File } = {};
    if (name !== lp?.name) updateData.name = name;
    if (content !== lp?.content) updateData.content = content;
    if (JSON.stringify(tags) !== JSON.stringify(lp?.tags)) updateData.tags = tags;
    if (image) updateData.image = image;

    if (Object.keys(updateData).length > 0) {
      updateMutation.mutate(updateData);
    } else {
      navigate(`/lp/${lpId}`);
    }
  };

  if (isLoading) {
    return <LPDetailSkeleton />;
  }

  if (!lp) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">LP를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">LP 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">LP 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">설명</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">태그</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="태그 입력 후 추가 버튼 클릭"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-pink-600/20 text-pink-400 rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-pink-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LP 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full max-w-xs aspect-square object-cover rounded-lg"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLPPage;

