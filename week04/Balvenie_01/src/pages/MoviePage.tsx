import { useParams, useNavigate } from 'react-router-dom'
import { MoivePoster } from '../components/MoviePoster'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { useCustomFetch } from '../hooks/useCustomFetch'
import type { MovieResponseT } from '../types/movie'

const MoviePage = () => {
	const { category, page } = useParams()
	const navigate = useNavigate()

	const currentPage = parseInt(page || '1')
	const url = `/movie/${category}?language=ko-KR&page=${page}`

	const { data: movieResponse, isLoading, error } = useCustomFetch<MovieResponseT>(url)
	const movieList = movieResponse?.results || []

	const handlePageChange = (page: number) => {
		navigate(`/movie/${category}/${page}`)
	}

	return (
		<>
			<Pagination currentPage={currentPage} onPageChange={handlePageChange} />

			{isLoading ? (
				<Loading />
			) : error ? (
				<div className='flex items-center justify-center pt-14'>
					<div className='text-red-500 text-lg'>{error}</div>
				</div>
			) : (
				<div className='flex items-center justify-center pt-14'>
					<div className='grid grid-cols-7 gap-8'>
						{movieList?.map((movie) => (
							<MoivePoster key={movie.id} movie={movie} />
						))}
					</div>
				</div>
			)}
		</>
	)
}

export default MoviePage