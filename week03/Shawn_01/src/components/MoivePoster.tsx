import type { MovieT } from "../types/movie"
import { useNavigate } from 'react-router-dom'

export const MoivePoster = ({ movie }: { movie: MovieT }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate(`/movies/${movie.id}`)
	}

	return (
		<div className='rounded-xl w-48 h-72 cursor-pointer' onClick={handleClick}>
			<div className='relative group hover:scale-105 transition-all duration-300 drop-shadow-xl'>
				<img
					className='w-full h-full object-cover rounded-xl group-hover:blur-sm transition-all duration-300'
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
				<div className='absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-xl flex flex-col justify-center p-4'>
					<p className='text-white font-bold text-lg mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center'>{movie.title}</p>
					<p className='text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3'>{movie.overview}</p>
				</div>
			</div>
		</div>
	)
}