import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, patchMyInfo } from '../apis/authApi';
import { useAuth } from '../context/AutoContext';

export const MyPage = () => {
  const queryClient = useQueryClient();
  
  const { updateUserInfo } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });

  const targetData = userData?.data?.data || userData?.data;
  const userInfo = Array.isArray(targetData) ? targetData[0] : targetData;

  useEffect(() => {
    if (userInfo) {
        setName(userInfo.name || '');
        setBio(userInfo.bio || '');
        setPreview(userInfo.avatar || null);
    }
  }, [userInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const { mutate: updateProfile } = useMutation({
    mutationFn: (formData: FormData) => patchMyInfo(formData),
    onSuccess: async (response, variables) => {
        await queryClient.invalidateQueries({ queryKey: ['myInfo'] });
        
        const newName = variables.get('name') as string;
        const newBio = variables.get('bio') as string;
        
        setName(newName);
        setBio(newBio);
        
        if (newName && typeof updateUserInfo === 'function') {
            updateUserInfo(newName);
        }

        alert('정보가 수정되었습니다!');
        setIsEditing(false);
    },
    onError: (err) => {
      console.error(err);
      alert('수정 실패! 콘솔 확인');
    }
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (file) formData.append('avatar', file); 

    updateProfile(formData);
  };

  if (isLoading) return <div className="text-white p-8">Loading...</div>;

  const displayName = (!isEditing && userInfo?.name && name === '') ? userInfo.name : name;
  const displayBio = (!isEditing && userInfo?.bio && bio === '') ? userInfo.bio : bio;
  const avatarText = displayName ? displayName[0] : 'U';
  
  const displayImage = preview || userInfo?.avatar || `https://placehold.co/128x128?text=${avatarText}`;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-black w-full max-w-2xl p-8 rounded-xl flex items-center gap-8 shadow-2xl relative border border-neutral-800">
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2">⚙️</button>
            )}

            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-neutral-700">
                    <img src={displayImage} alt="profile" className="w-full h-full object-cover"/>
                </div>
                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-sm">
                        변경 <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>

            <div className="flex-1 space-y-4">
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                             <input value={name} onChange={(e) => setName(e.target.value)} className="bg-neutral-800 border border-neutral-600 text-white text-2xl font-bold rounded px-3 py-2 w-full focus:border-blue-500 outline-none"/>
                             <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">✔</button>
                             <button onClick={() => setIsEditing(false)} className="bg-red-600 text-white p-2 rounded hover:bg-red-700">✕</button>
                        </div>
                        <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="소개 입력" className="bg-neutral-800 border border-neutral-600 text-white/80 text-lg rounded px-3 py-2 w-full focus:border-blue-500 outline-none"/>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-white">{displayName}</h2>
                        <div className="border border-white/20 rounded-lg p-3">
                            <p className="text-xl text-white font-semibold">{displayBio}</p>
                        </div>
                    </>
                )}
                <p className="text-gray-400 font-medium">{userInfo?.email}</p>
            </div>
        </div>
    </div>
  );
};