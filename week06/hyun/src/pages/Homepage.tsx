import React from 'react';
import useGetLpList from '../hooks/queries/useGetLpList';

const Homepage = () => {
    const { data, isPending, isError } = useGetLpList({});
    if (isPending) return <div className="mt-20">Loading...</div>;
    if (isError)
        return <div className="mt-20">Error occurred while fetching data.</div>;

    return (
        <div>
            {data?.data.data.map((lp) => (
                <h1>{lp.title}</h1>
            ))}
            ;
        </div>
    );
};

export default Homepage;
