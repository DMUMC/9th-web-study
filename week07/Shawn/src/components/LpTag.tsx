import { X } from "lucide-react"

interface LpTagProps {
    tag: string
    onDelete: () => void
}

export const LpTag = ({tag, onDelete}: LpTagProps) => {
    return (
        <div className='flex gap-2 items-center bg-neutral-700 text-white px-2 py-3 rounded-md'>
            <p className='text-sm'>{tag}</p>
            <X className='w-4 h-4 cursor-pointer' onClick={onDelete} />
        </div>
    )
}