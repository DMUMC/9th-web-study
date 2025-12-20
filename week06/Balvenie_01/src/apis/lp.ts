import type { PagenationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

/**
 * LP 리스트 조회 API
 */
export const getLpList = async (
  paginationDto: PagenationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get<ResponseLpListDto>("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

/**
 * LP 상세 조회 API
 */
export const getLpDetail = async (
  lpId: number
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get<ResponseLpDetailDto>(
    `/v1/lps/${lpId}`
  );
  return data;
};