import { useQuery } from "@tanstack/react-query";
import type { PagenationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../key";
import type { ResponseLpListDto } from "../../types/lp";

function useGetLpList(params: PagenationDto) {
  const { cursor, search, order, limit } = params;

  return useQuery<ResponseLpListDto>({
    queryKey: [QUERY_KEY.lps, search, order, cursor, limit],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;