import type { PagenationOrder } from "../enums/common";
import { PAGENATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type CursorBasedResponse<T> = CommonResponse<{
  data: T[];                // 리스트
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type PagenationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: PagenationOrder;
}