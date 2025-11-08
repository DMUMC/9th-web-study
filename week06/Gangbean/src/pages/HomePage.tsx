import useGetLpList from '../hooks/queries/useGetLpList';

const HomePage = () => {
    const { data, isPending, isError } = useGetLpList({});

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <div>
            {data?.map((lp) => (
                <h1 key={lp.id}>{lp.title}</h1>
            ))}
            <button
                type='button'
                className='fixed right-6 bottom-6 rounded-full px-5 py-3 bg-blue-500 text-white border-0 shadow-lg cursor-pointer focus:outline-none'
            >
                +
            </button>
        </div>
    );
};

export default HomePage;
