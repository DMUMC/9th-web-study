import { useParams } from "react-router"
import useGetLpDetail from "../hooks/queries/useGetLpDetail"
import { Spinner } from "../components/Spinner"
import { useEffect, useState } from "react"
import { formatRelativeTime } from '../utils/formatRelativeTime'
import useGetInfiniteLpComment from "../hooks/queries/useGetInfiniteLpComment"
import { useInView } from "react-intersection-observer"
import { LpComment } from "../components/LpComment/LpComment"
import { LpCommentSkeleton } from "../components/LpComment/LpCommentSkeleton"
import { Heart, Pencil, Trash } from 'lucide-react'
import useAddLpComment from '../hooks/mutation/LpComment/useAddLpComment'
import useGetMyInfo from "../hooks/queries/useGetMyInfo"

const LpDetailPage = () => {
	const { lpid } = useParams()
	const { data, isLoading, error } = useGetLpDetail({ lpid: Number(lpid) })
	const { data: myInfo } = useGetMyInfo()
	const [isLiked, setIsLiked] = useState(false)
	const [canEdit, setCanEdit] = useState(false)
    const [sort, setSort] = useState<'asc' | 'desc'>('asc')
    const [comment, setComment] = useState('')
    const { data: comments, isFetching, isFetchingNextPage, isPending, isError, hasNextPage, fetchNextPage } = useGetInfiniteLpComment(Number(lpid), 10, '', sort)
    const {ref, inView} = useInView({
        threshold: 0,
    })
	const addLpCommentMutation = useAddLpComment()

	// 코멘트 작성 핸들러
	const handleAddLpComment = () => {
		addLpCommentMutation.mutate({
			lpid: Number(lpid),
			commentData: {
				content: comment,
			},
		})
		setComment('')
	}

    useEffect(() => {
        if (inView && !isFetching && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage])

	useEffect(() => {
		if (myInfo?.data.id === data?.data.author.id) {
			setCanEdit(true)
		} else {
			setCanEdit(false)
		}
	}, [myInfo?.data.id, data?.data.author.id])

	if (isLoading) return <Spinner />;

	if (error) return <div>에러가 발생했습니다.</div>

	return (
		<div className='flex flex-col items-center w-3/5'>
			<div className='flex flex-col gap-4 mt-10 bg-neutral-600 p-4 px-12 rounded-md w-full mb-10'>
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
						{canEdit && (
							<>
								<Pencil className='w-6 h-6 cursor-pointer' strokeWidth='2' />
								<Trash className='w-6 h-6 cursor-pointer' strokeWidth='2' />
							</>
						)}
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
					<Heart className='w-6 h-6 cursor-pointer' onClick={() => setIsLiked(!isLiked)} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
					<p>{data?.data.likes.length}</p>
				</div>
			</div>

			{/*댓글*/}
			<div className='flex flex-col gap-4 mt-10 bg-neutral-600 p-4 px-12 rounded-md w-full mb-10'>
				{/*정렬*/}
				<div className='flex justify-between items-center'>
					<p className='text-xl font-bold'>댓글</p>
					<div className='flex gap-2'>
						<button
							className={`${
								sort === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
							} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`}
							onClick={() => setSort('asc')}>
							최신순
						</button>
						<button
							className={`${
								sort === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
							} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`}
							onClick={() => setSort('desc')}>
							오래된순
						</button>
					</div>
				</div>

				{/*댓글 작성 */}
				<div className='flex gap-4'>
					<input
						className='w-full p-2 rounded-md border-2 border-gray-300'
						type='text'
						placeholder='댓글을 입력해주세요.'
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button className='bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300 w-24' onClick={handleAddLpComment}>
						작성
					</button>
				</div>

				{/*댓글 목록*/}
				<div className='flex flex-col gap-3'>
					{comments?.pages
						?.map((page) => page.data.data)
						.flat()
						.map((comment) => (
							<LpComment key={comment.id} comment={comment} />
						))}
					<div ref={ref} className='h-10'>
						{isFetching && isPending && Array.from({ length: 10 }).map((_, index) => <LpCommentSkeleton key={index} />)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default LpDetailPage