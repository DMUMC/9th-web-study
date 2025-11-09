import useGetLpList from "../hooks/queries/useGetLpList"

const MainPage = () => {
    const {data, isLoading, error} = useGetLpList({cursor: undefined, limit: undefined, search: undefined, order: undefined})
    return (
        <>
            <p>메인페이지</p>
        </>
    )
}

export default MainPage