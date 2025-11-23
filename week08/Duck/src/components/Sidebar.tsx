import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount";
import ConfirmModal from "./ConfirmModal";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { accessToken } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const menuItems = [
    { label: "홈", to: "/" },
    { label: "찾기", to: "/search" },
    { label: "마이페이지", to: "/my" },
  ];

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-purple-200 bg-gradient-to-b from-purple-50 to-pink-50 pt-24 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:block md:translate-x-0 md:bg-transparent md:pt-24 md:shadow-none`}
      >
        <nav className="space-y-2 px-6 py-4">
          {menuItems.map(({ label, to }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={label}
                to={to}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                }`}
                onClick={onClose}
              >
                {label}
              </Link>
            );
          })}
          {accessToken && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:shadow-md"
            >
              탈퇴하기
            </button>
          )}
        </nav>
      </aside>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="계정 탈퇴"
        message="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="예, 탈퇴합니다"
        cancelText="취소"
        isDanger
      />
    </>
  );
};

export default Sidebar;
