import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AutoContext';
import { useMutation } from '@tanstack/react-query';
import { postLogout, deleteAccount } from '../apis/authApi';

const ConfirmModal = ({ title, onConfirm, onCancel }: { title: string, onConfirm: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-xl w-80 text-center">
      <h3 className="text-white text-lg font-bold mb-6">{title}</h3>
      <div className="flex justify-center gap-4">
        <button onClick={onConfirm} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">예</button>
        <button onClick={onCancel} className="bg-pink-600 text-white px-6 py-2 rounded font-bold hover:bg-pink-700">아니오</button>
      </div>
    </div>
  </div>
);

export const Sidebar = () => {
  const { token, logout: contextLogout } = useAuth();
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useMutation({
    mutationFn: postLogout,
    onSuccess: () => contextLogout(),
    onError: () => contextLogout()
  });

  const { mutate: withdrawMutate } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      alert('탈퇴가 완료되었습니다.');
      contextLogout();
      navigate('/login');
    },
    onError: (err) => {
        alert('탈퇴 실패: ' + err);
        setShowWithdrawModal(false);
    }
  });

  return (
    <>
      <aside className="sticky top-0 h-screen w-56 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 z-10 flex flex-col">
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavLink to="/lps" className={({ isActive }) => `block px-4 py-2 rounded-md font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-neutral-800'}`}>찾기 (LP 목록)</NavLink>
          <NavLink to="/mypage" className={({ isActive }) => `block px-4 py-2 rounded-md font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-neutral-800'}`}>마이페이지</NavLink>
        </nav>
        
        <div className="p-4 border-t border-neutral-800 space-y-2">
           {isAuthenticated ? (
             <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="text-xs text-gray-500 hover:text-red-500 underline self-center mt-2"
                >
                  탈퇴하기
                </button>
             </div>
          ) : (
            <>
              <NavLink to="/login" className="block text-center px-4 py-2 rounded-md font-medium bg-neutral-800 text-gray-300 hover:bg-neutral-700">로그인</NavLink>
              <NavLink to="/signup" className="block text-center px-4 py-2 rounded-md font-bold bg-blue-600 text-white hover:bg-blue-700">회원가입</NavLink>
            </>
          )}
        </div>
      </aside>

      {showWithdrawModal && (
        <ConfirmModal 
            title="정말 탈퇴하시겠습니까?" 
            onConfirm={() => withdrawMutate()} 
            onCancel={() => setShowWithdrawModal(false)} 
        />
      )}
    </>
  );
};