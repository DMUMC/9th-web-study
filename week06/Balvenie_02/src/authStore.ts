type Listener = () => void;

export function normalizeTokenStr(raw: unknown) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^"+|"+$/g, '');
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
    this._access  = normalizeTokenStr(localStorage.getItem('accessToken'));
    this._refresh = normalizeTokenStr(localStorage.getItem('refreshToken'));
    this._expAt   = Number(localStorage.getItem('accessTokenExpAt')) || null;
    this.scheduleRefresh();
  }

  get token() { return this._access; }
  get refreshToken() { return this._refresh; }
  get expAt() { return this._expAt; }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private notify() { this.listeners.forEach((fn) => fn()); }

  setToken(access: string | null) {
    this._access = normalizeTokenStr(access);
    if (this._access) localStorage.setItem('accessToken', this._access);
    else localStorage.removeItem('accessToken');
    this.notify();
  }

  setTokens(access: string, refresh: string, expAtMs?: number) {
    this._access  = normalizeTokenStr(access);
    this._refresh = normalizeTokenStr(refresh);
    this._expAt   = expAtMs ?? (Date.now() + 1000 * 60 * 30); // 서버가 안주면 30분 가정

    localStorage.setItem('accessToken', this._access!);
    localStorage.setItem('refreshToken', this._refresh!);
    localStorage.setItem('accessTokenExpAt', String(this._expAt));

    this.notify();
    this.scheduleRefresh(true);
  }

  clear() {
    this._access = this._refresh = null;
    this._expAt = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpAt');
    if (this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = null; }
    this.notify();
  }

  // ✅ 로그아웃 공개 메서드 (constructor 바깥!)
  logout() {
    this.clear();
    window.dispatchEvent(new Event('auth:changed'));
  }

  private scheduleRefresh(reset = false) {
    if (reset && this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = null; }
    if (!this._expAt || !this._refresh) return;

    const due = Math.max(this._expAt - this.skewMs - Date.now(), 0);
    this.refreshTimer = window.setTimeout(() => {
      this.refresh().catch(() => this.clear());
    }, due);
  }

  async refresh(): Promise<void> {
    if (!this._refresh) throw new Error('No refresh token');
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: this._refresh }), // 백엔드 스펙에 맞춤
      credentials: 'include',
    });
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    const expAtMs =
      data.accessTokenExpiresAt ? new Date(data.accessTokenExpiresAt).getTime()
      : data.expiresIn ? Date.now() + data.expiresIn * 1000
      : undefined;

    this.setTokens(data.accessToken, data.refreshToken ?? this._refresh!, expAtMs);
  }
}

export const authStore = new AuthStore();