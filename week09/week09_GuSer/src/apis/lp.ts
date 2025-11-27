import axiosInstance from './axiosInstance';

export interface LP {
  id: number;
  name: string;
  content: string;
  imageUrl: string;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    profileImage?: string;
  };
}

export interface LPListResponse {
  lps: LP[];
  nextCursor?: string;
  hasNext: boolean;
}

export interface CreateLPData {
  name: string;
  content: string;
  tags: string[];
  image: File;
}

export interface UpdateLPData {
  name?: string;
  content?: string;
  tags?: string[];
  image?: File;
}

export const getLPs = async (cursor?: string, sort: 'asc' | 'desc' = 'desc'): Promise<LPListResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('sort', sort);
  
  try {
    const response = await axiosInstance.get(`/v1/lps?${params.toString()}`);
    
    // 서버 응답 구조에 따라 조정
    const responseData = response.data;
    
    // 디버깅을 위한 로그 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('LP 목록 응답:', responseData);
    }
    
    // 경우 1: { data: { lps, nextCursor, hasNext } } 형태
    if (responseData?.data && Array.isArray(responseData.data.lps)) {
      return {
        lps: responseData.data.lps.filter((lp: any) => lp && lp.id),
        nextCursor: responseData.data.nextCursor,
        hasNext: responseData.data.hasNext ?? false,
      };
    }
    
    // 경우 2: { lps, nextCursor, hasNext } 형태
    if (Array.isArray(responseData?.lps)) {
      return {
        lps: responseData.lps.filter((lp: any) => lp && lp.id),
        nextCursor: responseData.nextCursor,
        hasNext: responseData.hasNext ?? false,
      };
    }
    
    // 경우 3: 배열 자체가 응답인 경우
    if (Array.isArray(responseData)) {
      return {
        lps: responseData.filter((lp: any) => lp && lp.id),
        nextCursor: undefined,
        hasNext: false,
      };
    }
    
    // 기본값 반환
    return {
      lps: [],
      nextCursor: undefined,
      hasNext: false,
    };
  } catch (error) {
    console.error('LP 목록 가져오기 실패:', error);
    throw error;
  }
};

export const getLP = async (lpId: number): Promise<LP> => {
  const response = await axiosInstance.get(`/v1/lps/${lpId}`);
  return response.data;
};

export const createLP = async (data: CreateLPData): Promise<LP> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('content', data.content);
  formData.append('image', data.image);
  // NestJS는 배열을 여러 번 append하거나 JSON 문자열로 보낼 수 있음
  data.tags.forEach((tag) => formData.append('tags', tag));

  const response = await axiosInstance.post('/v1/lps', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateLP = async (lpId: number, data: UpdateLPData): Promise<LP> => {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.content) formData.append('content', data.content);
  if (data.image) formData.append('image', data.image);
  if (data.tags) {
    data.tags.forEach((tag) => formData.append('tags', tag));
  }

  const response = await axiosInstance.patch(`/v1/lps/${lpId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteLP = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const toggleLikeLP = async (lpId: number): Promise<{ isLiked: boolean; likeCount: number }> => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/like`);
  return response.data;
};

