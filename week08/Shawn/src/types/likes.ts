import type { CommonResponse } from "./common";

export type ResponseLikesLp = CommonResponse<{
    id: number
    userId: number
    lpId: number
}>