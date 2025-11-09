import { useEffect, useRef, useState } from 'react'
import { LpCard } from '../components/LpCard/LpCard'
import { Spinner } from '../components/Spinner'
//import useGetLpList from "../hooks/queries/useGetLpList"
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList'
import LpCardSkeleton from '../components/LpCard/LpCardSkeleton'

const LpListPage = () => {
	const [sort, setSort] = useState<'asc' | 'desc'>('asc')
	const [search, setSearch] = useState('')
	//const {data, isLoading, error} = useGetLpList({cursor: undefined, limit: undefined, search: undefined, order: sort});
	const { data: lps, isFetching, isFetchingNextPage, isPending, isError, hasNextPage, fetchNextPage } = useGetInfiniteLpList(10, search, sort)
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!sentinelRef.current) return

		const el = sentinelRef.current
		const observer = new IntersectionObserver((entries) => {
			const first = entries[0]
			if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		})

		observer.observe(el)

		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	if (isPending) {
		return <Spinner />
	}

	if (isError) {
		return (
			<>
				<p>에러가 발생했습니다.</p>
				<button onClick={() => (window.location.href = '/lps')}>재시도</button>
			</>
		)
	}

	return (
		<div className='flex flex-col gap-4 mt-10'>
			<div className='flex items-center gap-2 justify-end'>
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
			<div className='grid grid-cols-3'>
                <LpCardSkeleton />
				{lps?.pages
					?.map((page) => page.data.data)
					?.flat()
					?.map((lp) => (
						<LpCard key={lp.id} lp={lp} />
					))}
                <div ref={sentinelRef} className='h-100'>
                    {isFetching && Array.from({length: 10}).map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))}
                </div>
			</div>
		</div>
	)
}

export default LpListPage
