export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  LPS: '/lps',
  LP_DETAIL: '/lp/:lpId',
  CREATE_LP: '/create-lp',
  EDIT_LP: '/edit-lp/:lpId',
  MYPAGE: '/mypage',
  CART: '/cart',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 300;

