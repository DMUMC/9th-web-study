import { Outlet } from "react-router-dom"
import { Header } from "../components/Header"

export const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col bg-black">
      <header><Header /></header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
