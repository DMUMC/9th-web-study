import { useState, useEffect } from "react";
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

  // ESC 키로 Sidebar 닫기 기능
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // 클린업 함수: EventListener 등록 해제하여 메모리 누수 방지
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // 배경 스크롤 방지: Sidebar가 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      // overflow: hidden만 사용하여 스크롤 방지
      // position: fixed를 사용하지 않아 헤더에 영향 없음
      // 스크롤 위치는 자동으로 유지됨
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      // 스크롤 방지 해제
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    // 클린업 함수: 컴포넌트 언마운트 시 스크롤 방지 해제
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-pink-100/50 bg-white/95 backdrop-blur-xl pt-20 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } md:static md:block md:translate-x-0 md:opacity-100 md:bg-transparent md:shadow-none md:pt-20`}
      >
        <nav className="space-y-2 px-4 py-6">
          {menuItems.map(({ label, to }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
                }`}
                onClick={onClose}
              >
                {label === "홈" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                )}
                {label === "찾기" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                )}
                {label === "마이페이지" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
                {label}
              </Link>
            );
          })}
          {accessToken && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="mt-6 flex w-full items-center gap-3 rounded-xl border-2 border-red-200 px-4 py-3.5 text-left text-sm font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-300 hover:scale-105"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
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
