import { useDeleteUser } from "../../hooks/mutation/auth/useDeleteUser"
import { useLeaveModal } from "../../store/useLeaveModal"
import { X } from "lucide-react"

export const LeaveModal = () => {
    const { setIsLeaveModalOpen } = useLeaveModal()
    const deleteUserMutation = useDeleteUser()

    const handleDeleteUser = () => {
        deleteUserMutation.mutate()
    }

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setIsLeaveModalOpen(false)
    }

    return (
        <div className='absolute inset-0 flex justify-center items-center z-60'>
            <div className='flex flex-col gap-18 bg-neutral-600 rounded-md p-4 z-100 w-[500px] h-2/5 justify-center items-center relative'>
                <X className='self-end text-white absolute top-4 right-4 cursor-pointer' onClick={() => setIsLeaveModalOpen(false)} />
                <p className='text-white text-2xl font-bold'>정말 탈퇴하시겠습니까?</p>
                <div className='flex gap-12'>
                    <button className='w-20 h-10 rounded-md p-2 bg-neutral-400 text-white hover:bg-neutral-500 transition-all duration-300 cursor-pointer' onClick={() => setIsLeaveModalOpen(false)}>취소</button>
                    <button className='w-20 h-10 rounded-md p-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer' onClick={handleDeleteUser}>탈퇴</button>
                </div>
            </div>
            <div className='absolute inset-0 bg-black opacity-70 flex justify-center items-center z-60' onClick={handleBackgroundClick} />
        </div>
    )
}