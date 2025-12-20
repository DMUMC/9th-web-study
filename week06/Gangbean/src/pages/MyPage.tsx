import useGetMyInfo from '../hooks/queries/useGetMyInfo';

const MyPage = () => {
    const { data, isPending, isError } = useGetMyInfo();

    if (isPending) {
        return <div>로딩 중...</div>;
    }

    if (isError || !data) {
        return <div>내 정보를 불러오지 못했습니다.</div>;
    }

    return (
        <div>
            <div>{data.name}</div>
            <div>{data.email}</div>
        </div>
    );
};

export default MyPage;
