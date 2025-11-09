import { Link } from "react-router"

export const FloatingButton = () => {
    return (
        <div>
            <Link to="/create" className="fixed bottom-12 right-12 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </Link>
        </div>
    )
}