export const useLocalStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            localStorage.setItem(key, value as string);
        } catch (error) {
            console.log(error);
        }
    };

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const removeItem = () => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };

    return { setItem, getItem, removeItem };
};