import { useEffect, useState, useMemo } from 'react'
import { LpCard } from '../components/LpCard/LpCard'
import { Spinner } from '../components/Spinner'
//import useGetLpList from "../hooks/queries/useGetLpList"
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList'
import LpCardSkeleton from '../components/LpCard/LpCardSkeleton'
import { useDebounce } from '../hooks/useDebounce'
import { useInView } from 'react-intersection-observer'

const LpListPage = () => {
	const [sort, setSort] = useState<'asc' | 'desc'>('desc')
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search, 300)
	//const {data, isLoading, error} = useGetLpList({cursor: undefined, limit: undefined, search: undefined, order: sort});
	const { data: lps, isFetching, isPending, isError, hasNextPage, fetchNextPage } = useGetInfiniteLpList(10, debouncedSearch, sort)
	const { ref, inView } = useInView({
		threshold: 0,
	})

	const allLps = useMemo(() => {
		return lps?.pages?.map((page) => page.data.data)?.flat() || []
	}, [lps])

	useEffect(() => {
		if (inView && !isFetching && hasNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetching, fetchNextPage])

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
		<div className='flex flex-col gap-4 mt-10 w-3/5'>
			<div className='flex items-center gap-2 border-1 border-gray-300 rounded-md p-2'>
				<input type='text' placeholder='Search' className='w-full outline-none' value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>

			<div className='flex items-center gap-2 justify-end'>
				<button
					className={`${
						sort === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
					} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`}
					onClick={() => setSort('desc')}>
					최신순
				</button>
				<button
					className={`${
						sort === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
					} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`}
					onClick={() => setSort('asc')}>
					오래된순
				</button>
			</div>
			<div className='grid grid-cols-3 gap-6'>
				{allLps.length > 0 ? allLps.map((lp) => <LpCard key={lp.id} lp={lp} />) : <p className='col-span-3 text-center text-gray-400'>검색 결과가 없습니다.</p>}
				<div ref={ref} className='h-1 w-full col-span-3'>
					{isFetching && Array.from({ length: 6 }).map((_, index) => <LpCardSkeleton key={index} />)}
				</div>
			</div>
		</div>
	)
}

export default LpListPage
