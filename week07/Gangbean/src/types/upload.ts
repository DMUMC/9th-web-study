import type { CommonResponse } from './common';

export type ResponseImageUploadDto = CommonResponse<{
    imageUrl: string;
}>;
