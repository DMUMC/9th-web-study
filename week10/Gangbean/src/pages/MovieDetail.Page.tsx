import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <h1 className='text-2xl font-bold'>
            {id}번 영화 상세 페이지
        </h1>
    );
};

export default MovieDetailPage;
