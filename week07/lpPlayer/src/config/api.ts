const raw = import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const trimmed = String(raw).trim().replace(/\/+$/, '');
const origin = trimmed.replace(/\/v1$/i, '') || trimmed;

export const API_ORIGIN = origin;
export const API_BASE_URL = `${API_ORIGIN}/v1`;
