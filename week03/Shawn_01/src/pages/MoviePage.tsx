import { useEffect, useState } from "react";
import type { MovieResponseT, MovieT } from "../types/movie";
import { api } from "../utils/AxiosInstance"
import { MoivePoster } from "../components/MoivePoster"

const MoviePage = () => {
    const [movieList, setMovieList] = useState<MovieT[] | null>([])

    // 영화 목록 조회 API 호출
    useEffect(() => {
        const getMovieList = async () => {
            const res = await api.get<MovieResponseT>('/movie/popular?language=ko-KR&page=1')
            setMovieList(res.data.results)
        }
        getMovieList()
    },[])

    useEffect(() => {
        console.log(movieList)
    },[movieList])

    return (
        <div className='flex items-center justify-center pt-14'>
            <div className='grid grid-cols-7 gap-8'>
                {movieList?.map((movie) => (
                    <MoivePoster key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}

export default MoviePage