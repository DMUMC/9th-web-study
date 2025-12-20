export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };

    const getItem = () => {
        try {
            return localStorage.getItem(key);
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
