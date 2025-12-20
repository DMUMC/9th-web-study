type Listener = () => void;

class AuthStore {
  private _token: string | null;
  private listeners = new Set<Listener>();

  constructor() {
    const raw = localStorage.getItem('accessToken');
    this._token = normalizeTokenStr(raw);
  }

  get token() {
    return this._token;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
    // 외부 탭/프레임 호환 및 과거 코드 호환용 커스텀 이벤트
    window.dispatchEvent(new Event('auth:changed'));
  }

  setToken(token: string | null) {
    this._token = normalizeTokenStr(token);
    if (this._token) localStorage.setItem('accessToken', this._token);
    else localStorage.removeItem('accessToken');
    this.notify();
  }
}

export const authStore = new AuthStore();

export function normalizeTokenStr(raw: unknown) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^"+|"+$/g, '');
  if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return null;
  return s;
}