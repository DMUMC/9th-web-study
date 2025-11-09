import { useNavigate } from "react-router"
import type { Lp } from "../../types/lp"
import { formatRelativeTime } from "../../utils/formatRelativeTime"

interface LpCardProps {
    lp: Lp
}

export const LpCard = ({lp}: LpCardProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/lps/${lp.id}`)
    }

    return (
        <div className='w-64 h-64 rounded-md p-1 cursor-pointer' onClick={handleClick}>
            <div className='relative group hover:scale-105 transition-all duration-300 drop-shadow-lg w-full h-full'>
                <img src={lp.thumbnail} alt={lp.title} className="object-cover group-hover:opacity-30 transition-all duration-300 w-full h-full" />
                <div className='absolute inset-0 bg-opacity-0 transition-all justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='mt-auto flex flex-col gap-2 h-full justify-end'>
                        <p className='text-lg font-bold text-white group-hover:opacity-100 transition-opacity duration-300 line-clamp-3'>{lp.title}</p>
                        <div className='flex items-center gap-2'>
                            <p className="text-sm text-neutral-400 group-hover:opacity-100 transition-opacity duration-300">{formatRelativeTime(lp.createdAt)}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                            <p className="text-sm text-neutral-400 group-hover:opacity-100 transition-opacity duration-300">{lp.likes?.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}