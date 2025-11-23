import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteMyAccount } from "../apis/auth"
import { useAuthStore } from "../store/authStore"
import { ConfirmModal } from "./ConfirmModal"

interface SidebarProps {
  onNavigate?: () => void
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setLogout } = useAuthStore()

  const handleNavigate = () => {
    onNavigate?.()
  }

  const deleteAccountMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      setLogout()
      queryClient.clear()
      alert("회원 탈퇴가 완료되었습니다.")
      navigate('/')
    },
    onError: (error) => {
      console.error("회원 탈퇴 실패:", error)
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.")
    },
  })

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteAccountMutation.mutate()
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <nav className="flex h-full w-full flex-col justify-between bg-[#171717] p-6 text-white shadow-lg md:h-full md:shadow-none">
        <div className="flex flex-col gap-4">
          <div
            onClick={handleNavigate}
            className="w-full text-sm font-medium"
          >
            검색
          </div>
          <Link
            to="/mypage"
            onClick={handleNavigate}
            className="w-full text-sm font-medium"
          >
            마이페이지
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-full text-left text-sm font-medium text-red-400 hover:text-red-300"
        >
          탈퇴하기
        </button>
      </nav>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="회원 탈퇴"
        message="정말 회원 탈퇴를 하시겠습니까? 탈퇴한 계정은 복구할 수 없습니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        variant="danger"
      />
    </>
  )
}
