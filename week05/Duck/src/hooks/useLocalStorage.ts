import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      if (typeof initialValue === "string") {
        return item as T;
      }
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        if (typeof valueToStore === "string") {
          window.localStorage.setItem(key, valueToStore);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        window.dispatchEvent(new CustomEvent("localStorageChange"));
      }
    } catch {}
  };

  return [storedValue, setValue] as const;
}
