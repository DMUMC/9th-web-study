import { useParams } from "react-router"
import useGetLpDetail from "../hooks/queries/useGetLpDetail"
import { Spinner } from "../components/Spinner"
import { useState } from "react"
import { formatRelativeTime } from '../utils/formatRelativeTime'

const LpDetailPage = () => {
	const { lpid } = useParams()
	const { data, isLoading, error } = useGetLpDetail({ lpid: Number(lpid) })
	const [isLiked, setIsLiked] = useState(false)

	if (isLoading) return <Spinner />

	if (error) return <div>에러가 발생했습니다.</div>

	return (
		<div className='flex flex-col gap-4 mt-10 bg-neutral-600 p-4 rounded-md w-3/4 mb-10'>
			{/*작성 정보 */}
			<div className='flex justify-between items-center'>
				<div className='flex gap-2'>
					<img className='w-10 h-10 rounded-full object-cover' src={data?.data.author.avatar ?? 'https://via.placeholder.com/150'} alt={data?.data.author.name ?? ''} />
					<p>{data?.data.author.name}</p>
				</div>
				<p>{formatRelativeTime(data?.data.createdAt)}</p>
			</div>

			{/*제목 및 수정,삭제*/}
			<div className='flex justify-between items-center'>
				<p className='text-2xl font-bold'>{data?.data.title}</p>
				<div className='flex gap-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#ffffff'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						className='lucide lucide-pencil-icon lucide-pencil'>
						<path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
						<path d='m15 5 4 4' />
					</svg>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#ffffff'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						className='lucide lucide-trash2-icon lucide-trash-2'>
						<path d='M10 11v6' />
						<path d='M14 11v6' />
						<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' />
						<path d='M3 6h18' />
						<path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
					</svg>
				</div>
			</div>

			{/*LP */}
			<div className='flex justify-center items-center'>
				<div className='bg-neutral-700 shadow-2xl shadow-gray-900 p-4'>
					<img
						className='h-100 w-100 rounded-full border-4 border-gray-900 object-cover animate-[spin_12s_linear_infinite]'
						src={data?.data.thumbnail ?? 'https://via.placeholder.com/200'}
						alt={data?.data.title ?? ''}
					/>
				</div>
			</div>

			{/*내용*/}
			<div className='text-white'>
				<p className='text-sm'>{data?.data.content}</p>
			</div>

			{/*태그*/}
			<div className='flex gap-2'>
				{data?.data.tags.map((tag) => (
					<span key={tag.id} className='bg-neutral-700 text-white px-2 py-1 rounded-md'>
						{tag.name}
					</span>
				))}
			</div>

			{/*좋아요*/}
			<div className='flex items-center gap-2 justify-center'>
				<svg
					onClick={() => setIsLiked(!isLiked)}
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill={isLiked ? 'red' : 'none'}
					stroke={isLiked ? 'red' : 'currentColor'}
					stroke-width='3'
					stroke-linecap='round'
					stroke-linejoin='round'
					className='lucide lucide-heart-icon lucide-heart'>
					<path d='M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5' />
				</svg>
				<p>{data?.data.likes.length}</p>
			</div>
		</div>
	)
}

export default LpDetailPage