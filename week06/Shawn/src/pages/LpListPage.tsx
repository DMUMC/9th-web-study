import { useState } from "react"
import { LpCard } from "../components/LpCard"
import { Spinner } from "../components/Spinner"
import useGetLpList from "../hooks/queries/useGetLpList"

const LpListPage = () => {
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');
    const {data, isLoading, error} = useGetLpList({cursor: undefined, limit: undefined, search: undefined, order: sort});

    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        return (<>
            <p>에러가 발생했습니다.</p>
            <button onClick={() => window.location.href = '/lps'}>재시도</button>
        </>)
    }

    return(
        <div className='flex flex-col gap-4 mt-10'>
            <div className='flex items-center gap-2 justify-end'>
                <button className={`${sort === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`} onClick={() => setSort('asc')}>최신순</button>
                <button className={`${sort === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300`} onClick={() => setSort('desc')}>오래된순</button>
            </div>
            <div className='grid grid-cols-4'>
            {data?.data.data.map((lp) => (
                    <LpCard key={lp.id} id={lp.id} title={lp.title} thumbnail={lp.thumbnail} createdAt={lp.createdAt} likes={lp.likes} />
                ))}
            </div>
        </div>
    );
}

export default LpListPage