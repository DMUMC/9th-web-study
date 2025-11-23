import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLp, patchLp } from '../apis/lpApi';
import { uploadImage } from '../apis/imageApi';

interface CreateLpModalProps {
  onClose: () => void;
  lpId?: number; 
  initialData?: { 
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
  };
}

export const CreateLpModal = ({ onClose, lpId, initialData }: CreateLpModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!lpId; 

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [thumbnailUrl, setThumbnailUrl] = useState(''); 
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      const loadedTags = initialData.tags.map((t: any) => t.name || t); 
      setTags(loadedTags);
      setThumbnailUrl(initialData.thumbnail);
    }
  }, [isEditMode, initialData]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      
      const response = await uploadImage(selectedFile);
      
      const uploadedUrl = response.data?.imageUrl; 

      if (uploadedUrl) {
          console.log("이미지 업로드 성공:", uploadedUrl);
          setThumbnailUrl(uploadedUrl);
      } else {
          throw new Error("이미지 URL을 받지 못했습니다.");
      }

    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const { mutate: createMutate, isPending: isCreatePending } = useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 등록되었습니다.');
      onClose();
    },
    onError: (err: any) => alert(err.response?.data?.message || '등록 실패')
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: any) => patchLp(lpId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] }); 
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] }); 
      alert('LP가 수정되었습니다.');
      onClose();
    },
    onError: (err: any) => alert(err.response?.data?.message || '수정 실패')
  });

  const handleSubmit = () => {
    if (!title || !content) return alert('제목과 내용은 필수입니다.');
    if (!thumbnailUrl) return alert('이미지를 등록해주세요 (또는 업로드 중입니다).');

    const payload = {
      title,
      content,
      thumbnail: thumbnailUrl,
      tags, 
      published: true
    };

    console.log("최종 전송 데이터:", payload);

    if (isEditMode) {
      updateMutate(payload);
    } else {
      createMutate(payload);
    }
  };

  const isPending = isCreatePending || isUpdatePending || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#2a2a2a] w-full max-w-lg rounded-xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

        <div className="flex justify-center mb-6">
            <label className="relative w-48 h-48 rounded-full bg-black border-4 border-[#111] overflow-hidden flex items-center justify-center cursor-pointer group shadow-lg">
                {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt="preview" 
                      className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`} 
                    />
                ) : (
                    <div className="text-gray-500 group-hover:text-white transition-colors text-center">
                        <span className="text-xs">{isUploading ? '업로드 중...' : '이미지 업로드'}</span>
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
            </label>
        </div>

        <div className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="LP Name" className="w-full bg-[#333] text-white px-4 py-3 rounded-md focus:outline-none border border-[#444]" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="LP Content" className="w-full bg-[#333] text-white px-4 py-3 rounded-md focus:outline-none border border-[#444] resize-none" />
            
            <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="LP Tag" onKeyDown={e => e.key === 'Enter' && handleAddTag()} className="flex-1 bg-[#333] text-white px-4 py-3 rounded-md focus:outline-none border border-[#444]" />
                <button onClick={handleAddTag} className="bg-blue-600 text-white px-4 rounded-md font-bold hover:bg-blue-700">Add</button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-white">✕</button>
                    </span>
                ))}
            </div>
        </div>

        <button onClick={handleSubmit} disabled={isPending} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? '처리 중...' : (isEditMode ? '수정하기' : 'Add LP')}
        </button>
      </div>
    </div>
  );
};