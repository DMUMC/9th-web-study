import { api } from './apis/axios';
import { LOCAL_STORAGE_KEY } from './key';
import { storage } from './utils/storage';

type Listener = () => void;

const ACCESS_EXP_KEY = 'accessTokenExpAt';

export function normalizeTokenStr(raw: unknown) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/^"+|"+$/g, '');
  if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return null;
  return s;
}

class AuthStore {
  private _access: string | null;
  private _refresh: string | null;
  private _expAt: number | null; // ms epoch
  private listeners = new Set<Listener>();
  private refreshTimer: number | null = null; // window.setTimeout id
  private skewMs = 20_000; // 만료 20초 전에 미리 갱신

  constructor() {
    this._access = normalizeTokenStr(storage.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN));
    this._refresh = normalizeTokenStr(storage.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN));
    this._expAt =
      typeof window !== 'undefined'
        ? Number(window.localStorage.getItem(ACCESS_EXP_KEY)) || null
        : null;
    this.scheduleRefresh();
  }

  get token() {
    return this._access;
  }
  get refreshToken() {
    return this._refresh;
  }
  get expAt() {
    return this._expAt;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  setToken(access: string | null) {
    this._access = normalizeTokenStr(access);
    if (this._access) storage.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, this._access);
    else storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    this.notify();
  }

  setTokens(access: string, refresh: string, expAtMs?: number) {
    this._access = normalizeTokenStr(access);
    this._refresh = normalizeTokenStr(refresh);
    this._expAt = expAtMs ?? Date.now() + 1000 * 60 * 30; // 서버가 안주면 30분 가정

    if (this._access) storage.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, this._access);
    else storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (this._refresh) storage.set(LOCAL_STORAGE_KEY.REFRESH_TOKEN, this._refresh);
    else storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ACCESS_EXP_KEY, String(this._expAt));
    }

    this.notify();
    this.scheduleRefresh(true);
  }

  clear() {
    this._access = this._refresh = null;
    this._expAt = null;
    storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACCESS_EXP_KEY);
    }
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.notify();
  }

  // ✅ 로그아웃 공개 메서드 (constructor 바깥!)
  logout() {
    this.clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:changed'));
    }
  }

  private scheduleRefresh(reset = false) {
    if (reset && this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (!this._expAt || !this._refresh || typeof window === 'undefined') return;

    const due = Math.max(this._expAt - this.skewMs - Date.now(), 0);
    this.refreshTimer = window.setTimeout(() => {
      this.refresh().catch(() => this.clear());
    }, due);
  }

  async refresh(): Promise<void> {
    if (!this._refresh) throw new Error('No refresh token');

    const { data } = await api.post('/auth/refresh', { refresh: this._refresh });
    const payload = (data && 'data' in data ? data.data : data) as {
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpiresAt?: string;
      expiresIn?: number;
    };

    if (!payload?.accessToken) {
      throw new Error('refresh failed');
    }

    const expAtMs = payload.accessTokenExpiresAt
      ? new Date(payload.accessTokenExpiresAt).getTime()
      : payload.expiresIn
      ? Date.now() + payload.expiresIn * 1000
      : undefined;

    this.setTokens(payload.accessToken, payload.refreshToken ?? this._refresh!, expAtMs);
  }
}

export const authStore = new AuthStore();
