// src/types/common.ts

export interface PaginationDto {
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  cursor?: number;
}