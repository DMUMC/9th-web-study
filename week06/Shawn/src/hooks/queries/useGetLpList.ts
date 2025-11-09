import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constant/key";

const useGetLpList = ({cursor, limit, search, order}: PaginationDto) => {
    return useQuery({
        queryKey: [QUERY_KEY.lps],
        queryFn: () => getLpList({cursor, limit, search, order}),
    })
}

export default useGetLpList