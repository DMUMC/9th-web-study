import { useEffect, useState } from 'react';
import axios from 'axios';

interface FetchState<T> {
    data: T | null;
    isPending: boolean;
    isError: boolean;
}

export const useCustomFetch = <T>(url: string, dependencies: any[] = []) => {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        isPending: false,
        isError: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            setState((prev) => ({ ...prev, isPending: true, isError: false }));

            try {
                const { data } = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_TMDB_KEY
                        }`,
                    },
                });
                setState({ data, isPending: false, isError: false });
            } catch {
                setState((prev) => ({
                    ...prev,
                    isPending: false,
                    isError: true,
                }));
            }
        };

        fetchData();
    }, dependencies);

    return state;
};
