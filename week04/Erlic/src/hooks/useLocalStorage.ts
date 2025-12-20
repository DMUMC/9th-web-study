import { useCallback, useEffect, useState } from "react";

type UseLocalStorageReturn<T> = [T | null, (nextValue: T | null) => void, () => void];

function readValue<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return null;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error("Failed to read localStorage key:", key, error);
    return null;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | null = null): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    const value = readValue<T>(key);
    return value ?? initialValue;
  });

  useEffect(() => {
    if (storedValue === null || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Failed to write to localStorage key:", key, error);
    }
  }, [key, storedValue]);

  const updateValue = useCallback(
    (nextValue: T | null) => {
      setStoredValue(nextValue);

      if (typeof window === "undefined") {
        return;
      }

      if (nextValue === null) {
        window.localStorage.removeItem(key);
        return;
      }

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch (error) {
        console.error("Failed to update localStorage key:", key, error);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(null);
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(key);
  }, [key]);

  return [storedValue, updateValue, removeValue];
}
