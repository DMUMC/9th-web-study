export const useLocalStorage = (key:string) => {
    // const setItem = (value:string) => {
    //     try {
    //         window.localStorage.setItem(key, JSON.stringify(value))
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // const getItem = () => {
    //     try {
    //         const item = window.localStorage.getItem(key)

    //         return item ? JSON.parse(item) : null
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    const setItem = (value:string) => {
        try {
            // 1. JSON.stringify 제거: 순수 문자열(토큰) 그대로 저장
            window.localStorage.setItem(key, value) 
        } catch (e) {
            console.log(e)
        }
    }
    
    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key)
            
            // 2. JSON.parse 제거: 순수 문자열(토큰) 그대로 반환
            return item || null 
        } catch (e) {
            console.log(e)
            return null;
        }
    }
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key)
        } catch (e) {
            console.log(e)
        }
    }

    return {setItem, getItem, removeItem}
}